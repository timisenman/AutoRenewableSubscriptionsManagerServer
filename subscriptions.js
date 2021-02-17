const dotenv = require('dotenv').config()
console.log(`Environment: ${process.env.NODE_ENV}`)
console.log(`DB URL: ${process.env.DATABASE_URL}`)
const https = require('https');
const fetch = require('node-fetch');
var db = require('./database');

const host = '0.0.0.0';

const express = require('express');
const { create } = require('domain');
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
const { request, response, query } = require('express');
const { assert } = require('console');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())

const appStoreSecret = '' //ADD YOUR SECRET HERE, FOUND IN APP STORE CONNECT

//Parent Dictionary key
const receiptData = 'receipt'

const receiptDataKey = 'latest_receipt' //Not a child
//Top Level Data - Child of receipt
const receiptType = 'receipt_type'
const appItemId = 'app_item_id'
const appVersion = 'application_version'
const downloadId = 'download_id'
const originalAppVersion = 'original_application_version' 
const originalPurchaseDateISO = 'original_purchase_date' 
const originalPurchaseDateUnix = 'original_purchase_date_ms'
const receiptCreationDateISO = 'receipt_creation_date' 
const receiptCreationDateUnix = 'receipt_creation_date' 
const receiptRequestDateISO = 'request_date'
const receiptRequestDateUnix = 'request_date_ms'

//Dictionary - Child of Receipt
const inAppPurchaseArray = 'in_app'
//Values are same as Latest Receipt

//Dictionary - Not a child - It's a Key
const latestReceiptInfo = 'latest_receipt_info'
//Values: Same as IAP values
const latestReceiptPurchaseDateISO = 'purchase_date'
const latestReceiptPurchaseDateUnix = 'purchase_date_ms'
const latestReceiptCancellationDateUnix = 'cancellation_date_ms'
const latestReceiptCancellationDateISO = 'cancellation_date'
const latestReceiptCancellationReason = 'cancellation_reason'
const latestReceiptExpiresDateISO = 'expires_date'
const latestReceiptExpiresDateUnix = 'expires_date_ms'
const latestReceiptIsIntroOfferPeriod = 'is_in_intro_offer_period'
const latestReceiptIsTrialPeriod = 'is_trial_period'
const latestReceiptOriginalPurchseDateISO = 'original_purchase_date'
const latestReceiptOriginalPurchseDateUnix = 'original_purchase_date_ms'
const latestReceiptProductId = 'product_id'

//Dictionary - Not a child
const pendingRenewalInfo = 'pending_renewal_info' 
//Values
const autoRenewalProductId = 'auto_renew_product_id'
const autoRenewalStatus = 'auto_renew_status' //will renew automatically
const autoRenewalExpirationIntent = 'expiration_intent' //if they've already expressed intent to not renew
const autoRenewalGracePeriodExpirationDateISO = 'grace_period_expires_date'
const autoRenewalGracePeriodExpirationDateUNIX = 'grace_period_expires_date_ms'
const autoRenewalInBillingPeriod = 'is_in_billing_retry_period'
const autoRenewalOfferCodeName = 'offer_code_ref_name'
const autoRenewalPriceConsentStatus = 'price_consent_status' //if a user was notified about a price increase - only present if they've seen a warning


app.listen(PORT, () => {
    // if (process.env.NODE_ENV === 'production') {
    // }
    console.log(`Running app on ${process.env.NODE_ENV}`)
    console.log(`Running app and listening at http://localhost:${PORT}`)
})

app.get('/', (request, response) => {
    // response.send('Bitch, you wanna make some mother fuckin money?')
    response.sendFile(__dirname + '/html/index.html')
})

app.post("/test", async (request, response) => {
    const test = `SELECT * FROM users;`
    db.query(test, (error, result) => {
        if (error) {
            console.log(error);
        }

        console.log(result.rows)
        response.status(200).json(result.rows)
    })

});

app.post("/register", async (request, response) => {
    //Grab user data from Pocket Rocket's POST request
    console.log(`Beginning new user request with request data: ${request.body['deviceId']}`)
    const userDeviceId = request.body['deviceId']
    const userTimeZone = request.body['timeFromGMT']
    const receiptData = request.body['receipt']

    const iTunesRequestBody = {
        'password': appStoreSecret,
        'receipt-data': receiptData,
        'exclude-old-transactions': false
    }
    
    console.log('Creating Apple request')
    const appStoreRequest = await fetch('https://sandbox.itunes.apple.com/verifyReceipt', {
        method: 'post',
        body: JSON.stringify(iTunesRequestBody),
        headers: {'Content-Type': 'application/json'}
    });
    
    console.log('Creating JSON from Apple request')
    const data = await appStoreRequest.json();

    try {
        console.log('Beginning query')
        writeUserDataAndReceiptToDatabase(data, userDeviceId, userTimeZone, () => {
            
            returnUserJSONData(userDeviceId, (rows, error) => {
                console.log(`Returning JSON after insertion. Results: ${rows}`)
                if (error) {
                    console.log(`${error} at ${new Date()}`)
                    response.status(500).json({ errors: { global: "Retrieval after insertion unsuccessful." } });
                }
                response.status(200).json({ 
                    success: "User successfully added"
                });
            });
        })
    } catch (error) {
        
        console.log(`Error from writing to DB for user ${userDeviceId}: ${error}`)
        const itunesStatus = data['status']

        const query = `INSERT INTO registration_errors (iTunesError, deviceId) VALUES (${itunesStatus}, ${userDeviceId});`
        db.query(query, (error, results) => {
            if (error) {
                
                console.log(`Failed at error insertion: ${console.log(error)}`);
            }
        })

        response.status(500)
    }
    

})

function writeUserDataAndReceiptToDatabase (data, userDeviceId, userTimeZone, callback) {
    if (data === null) {
        console.log('No data for the SQL query')
    } else {
        console.log(`Data looks good. Environment: ${data["environment"]}`)
    }

    //userName is blank
    const username = 'temp name'
    //no password yet
    const password = 'temp pw'
    //Also no email
    const emailAddress = 'tmp email'
    //deviceId
    const deviceId = userDeviceId
    //timezone
    const timezone = userTimeZone
    //subs to notifs is blank
    const subsToNotifs = 'TRUE'

    
    const receipt = data[receiptData]
    const latestReceiptPurchaseData = data[latestReceiptInfo][0]
    const renewalInfo = data[pendingRenewalInfo][0]
    const receiptKey = data[receiptDataKey]

    const iapJson = JSON.stringify(receipt[inAppPurchaseArray])
    const latestJson = JSON.stringify(data[latestReceiptInfo])
    const pendingRenewalJson = JSON.stringify(data[pendingRenewalInfo])

    const insertQuery = `INSERT INTO users (
        userName,
        email,
        password,
        deviceId,
        timeZoneFromGMT,
        subscribedToNotifications,
        receiptType,
        appItemId,
        appVersion,
        downloadId,
        receiptDataKey,
        originalAppVersion,
        originalPurchaseDateISO,
        originalPurchaseDateUnix,
        receiptCreationDateISO,
        receiptCreationDateUnix,
        receiptRequestDateISO,
        receiptRequestDateUnix,
        inAppPurchases,
        latestReceipts,
        latestReceiptPurchaseDateISO,
        latestReceiptPurchaseDateUnix,
        latestReceiptCancellationDateUnix,
        latestReceiptCancellationDateISO,
        latestReceiptCancellationReason,
        latestReceiptExpiresDateISO,
        latestReceiptExpiresDateUnix,
        latestReceiptIsIntroOfferPeriod,
        latestReceiptIsTrialPeriod,
        latestReceiptOriginalPurchseDateISO,
        latestReceiptOriginalPurchseDateUnix,
        latestReceiptProductId,
        pendingRenewalInfo,
        autoRenewalProductId,
        autoRenewalStatus,
        autoRenewalExpirationIntent,
        autoRenewalGracePeriodExpirationDateISO,
        autoRenewalGracePeriodExpirationDateUNIX,
        autoRenewalInBillingPeriod,
        autoRenewalOfferCodeName,
        autoRenewalPriceConsentStatus 
    ) VALUES (
        '${username}',
        '${emailAddress}',
        '${password}', 
        '${deviceId}',
        ${timezone},
        ${subsToNotifs},
        '${receipt[receiptType]}',
        ${receipt[appItemId]},
        '${receipt[appVersion]}',
        ${receipt[downloadId]},
        '${receiptKey}',
        '${receipt[originalAppVersion]}',
        '${receipt[originalPurchaseDateISO]}',
        '${receipt[originalPurchaseDateUnix]}',
        '${receipt[receiptCreationDateISO]}',
        '${receipt[receiptCreationDateUnix]}',
        '${receipt[receiptRequestDateISO]}',
        '${receipt[receiptRequestDateUnix]}',
        '${iapJson}', 
        '${latestJson}', 
        '${latestReceiptPurchaseData[latestReceiptPurchaseDateISO]}',
        '${latestReceiptPurchaseData[latestReceiptPurchaseDateUnix]}',
        '${latestReceiptPurchaseData[latestReceiptCancellationDateUnix]}',
        '${latestReceiptPurchaseData[latestReceiptCancellationDateISO]}',
        '${latestReceiptPurchaseData[latestReceiptCancellationReason]}',
        '${latestReceiptPurchaseData[latestReceiptExpiresDateISO]}',
        '${latestReceiptPurchaseData[latestReceiptExpiresDateUnix]}',
        '${latestReceiptPurchaseData[latestReceiptIsIntroOfferPeriod]}',
        '${latestReceiptPurchaseData[latestReceiptIsTrialPeriod]}',
        '${latestReceiptPurchaseData[latestReceiptOriginalPurchseDateISO]}',
        '${latestReceiptPurchaseData[latestReceiptOriginalPurchseDateUnix]}',
        '${latestReceiptPurchaseData[latestReceiptProductId]}',
        '${pendingRenewalJson}',
        '${renewalInfo[autoRenewalProductId]}',
        '${renewalInfo[autoRenewalStatus]}',
        ${renewalInfo[autoRenewalExpirationIntent]},
        '${renewalInfo[autoRenewalGracePeriodExpirationDateISO]}',
        '${renewalInfo[autoRenewalGracePeriodExpirationDateUNIX]}',
        '${renewalInfo[autoRenewalInBillingPeriod]}',
        '${renewalInfo[autoRenewalOfferCodeName]}',
        '${renewalInfo[autoRenewalPriceConsentStatus]}'
    );`
    
    db.query(insertQuery, (sqlError, results) => {
        const currentTime = new Date()
        if (sqlError != null) {
            console.log('SQL error: ' + sqlError + ` at ${currentTime}`)
        }

        console.log('No SQL errors at insert')
        console.log(results.rows)
        callback();
    });
}

function returnUserJSONData(userDeviceId, callback) {
    let query = `SELECT * FROM users WHERE deviceId = '${userDeviceId}';`;
    db.query(query, async (error, results) => {
        if (error) {
            console.log(`${new Date()}: SQL error at SELECT - ${error}`)
            await callback(null, error);
        } else {
            await callback(results.rows, null);
        }
    });
}

app.post("/checkStatus", async (request, response) => {
    const requestDeviceId = request.body['deviceId']
    console.log(request.body)
    const query = `SELECT latestReceiptExpiresDataUnix, autoRenewalProductId FROM users WHERE deviceId = '${requestDeviceId}';`
    db.query(query, (error, results) => {
        if (error) {
            console.log(error)
        } else {
            response.send(results.rows[0])
        }
    });
})

app.post("/updateUser", (request, response) => {
    console.log('Received update quest')
})



