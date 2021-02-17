const dotenv = require('dotenv').config()
const { response } = require('express');
const https = require('https');
const fetch = require('node-fetch');
const db = require('./database.js')

const pocketRocketSecret = 'c84bbada47fa4f7fb85b9e52ba09594c'

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

function udpdateAllReceipts() {
    console.log('Receipts Updating')

    const getAllUsersQuery = `SELECT deviceId, receiptDataKey FROM users;`
    db.query(getAllUsersQuery, async (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result.rows.length)

            for (i = 0; i < result.rows.length; i++) {
                console.log(result.rows[i]['deviceid'])

                const iTunesRequestBody = {
                    'password': pocketRocketSecret,
                    'receipt-data': result.rows[i]['receiptdatakey'],
                    'exclude-old-transactions': false
                }

                const appStoreRequest = await fetch('https://sandbox.itunes.apple.com/verifyReceipt', {
                    method: 'post',
                    body: JSON.stringify(iTunesRequestBody),
                    headers: {'Content-Type': 'application/json'}
                });
                
                const data = await appStoreRequest.json();
                console.log(data['environment'])

                updateDB(result.rows[i]['deviceid'], data)
            }
        }
    });

    

};

udpdateAllReceipts();

function updateDB(deviceId, data) {
    const receipt = data[receiptData]
    const latestReceiptPurchaseData = data[latestReceiptInfo][0]
    const renewalInfo = data[pendingRenewalInfo][0]
    const receiptKey = data[receiptDataKey]

    const iapJson = JSON.stringify(receipt[inAppPurchaseArray])
    const latestJson = JSON.stringify(data[latestReceiptInfo])
    const pendingRenewalJson = JSON.stringify(data[pendingRenewalInfo])
    const currentTime = new Date()

    const updateQuery = `UPDATE users SET
        updatedAt = NOW(),
        receiptType = '${receipt[receiptType]}',
        appItemId = ${receipt[appItemId]},
        appVersion = '${receipt[appVersion]}',
        downloadId = ${receipt[downloadId]},
        receiptDataKey = '${receiptKey}',
        originalAppVersion = '${receipt[originalAppVersion]}',
        originalPurchaseDateISO = '${receipt[originalPurchaseDateISO]}',
        originalPurchaseDateUnix = '${receipt[originalPurchaseDateUnix]}',
        receiptCreationDateISO = '${receipt[receiptCreationDateISO]}',
        receiptCreationDateUnix = '${receipt[receiptCreationDateUnix]}',
        receiptRequestDateISO = '${receipt[receiptRequestDateISO]}',
        receiptRequestDateUnix = '${receipt[receiptRequestDateUnix]}',
        inAppPurchases = '${iapJson}',
        latestReceipts = '${latestJson}',
        latestReceiptPurchaseDateISO = '${latestReceiptPurchaseData[latestReceiptPurchaseDateISO]}',
        latestReceiptPurchaseDateUnix = '${latestReceiptPurchaseData[latestReceiptPurchaseDateUnix]}',
        latestReceiptCancellationDateUnix = '${latestReceiptPurchaseData[latestReceiptCancellationDateUnix]}',
        latestReceiptCancellationDateISO = '${latestReceiptPurchaseData[latestReceiptCancellationDateISO]}',
        latestReceiptCancellationReason = '${latestReceiptPurchaseData[latestReceiptCancellationReason]}',
        latestReceiptExpiresDataISO = '${latestReceiptPurchaseData[latestReceiptExpiresDateISO]}',
        latestReceiptExpiresDataUnix = '${latestReceiptPurchaseData[latestReceiptExpiresDateUnix]}',
        latestReceiptIsIntroOfferPeriod = '${latestReceiptPurchaseData[latestReceiptIsIntroOfferPeriod]}',
        latestReceiptIsTrialPeriod = '${latestReceiptPurchaseData[latestReceiptIsTrialPeriod]}',
        latestReceiptOriginalPurchseDateISO = '${latestReceiptPurchaseData[latestReceiptOriginalPurchseDateISO]}',
        latestReceiptOriginalPurchseDateUnix = '${latestReceiptPurchaseData[latestReceiptOriginalPurchseDateUnix]}',
        latestReceiptProductId = '${latestReceiptPurchaseData[latestReceiptProductId]}',
        pendingRenewalInfo = '${pendingRenewalJson}',
        autoRenewalProductId = '${renewalInfo[autoRenewalProductId]}',
        autoRenewalStatus = '${renewalInfo[autoRenewalStatus]}',
        autoRenewalExpirationIntent = ${renewalInfo[autoRenewalExpirationIntent]},
        autoRenewalGracePeriodExpirationDateISO = '${renewalInfo[autoRenewalGracePeriodExpirationDateISO]}',
        autoRenewalGracePeriodExpirationDateUNIX = '${renewalInfo[autoRenewalGracePeriodExpirationDateUNIX]}',
        autoRenewalInBillingPeriod = '${renewalInfo[autoRenewalInBillingPeriod]}',
        autoRenewalOfferCodeName = '${renewalInfo[autoRenewalOfferCodeName]}',
        autoRenewalPriceConsentStatus = '${renewalInfo[autoRenewalPriceConsentStatus]}'
        WHERE deviceId = '${deviceId}';`

    db.query(updateQuery, (sqlError) => {
        const currentTime = new Date()
        if (sqlError != null) {
            console.log('SQL error: ' + sqlError + ` at ${currentTime}`)
        } else {
            console.log(`Updated ${deviceId}`)
        }
    });
}