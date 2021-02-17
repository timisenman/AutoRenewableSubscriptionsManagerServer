//Parent Dictionary key
const receiptData = 'receipt'

//Top Level Data
const downloadId = 'download_id'
const appVersion = 'application_version'
const receiptDataKey = 'latest_receipt' 
const originalAppVersion = 'original_application_version' 
const originalPurchaseDateISO = 'original_purchase_date' 
const originalPurchaseDateUnix = 'original_purchase_date_ms'
const receiptCreationDateISO = 'receipt_creation_date' 
const receiptCreationDateUnix = 'receipt_creation_date' 
const receiptRequestDateISO = 'request_date'
const receiptRequestDateUnix = 'request_date_ms'

//Dictionary
const inAppPurchaseArray = 'in_app'
//Values
const inAppPurchaseDateUnix = 'purchase_date_ms'
const inAppCancellationDateUnix = 'cancellation_date_ms'
const inAppCancellationDateISO = 'cancellation_date'
const inAppCancellationReason = 'cancellation_reason'
const inAppExpiresDataISO = 'expires_date'
const inAppExpiresDataUnix = 'expires_date_ms'
const inAppIsIntroOfferPeriod = 'is_in_intro_offer_period'
const inAppIsTrialPeriod = 'is_trial_period'
const inAppOriginalPurchseDateISO = 'original_purchase_date'
const inAppOriginalPurchseDateUnix = 'original_purchase_date_ms'
const inAppProductId = 'product_id'
const latestReceiptInfo = 'latest_receipt_info' //same structure as in_app

//Dictionary
const pendingRenewalInfo = 'pending_renewal_info' //key
//Values
const autoRenewalProductId = 'auto_renew_product_id'
const autoRenewalStatus = 'auto_renew_status' //will renew automatically
const autoRenewalExpirationIntent = 'expiration_intent' //if they've already expressed intent to not renew
const autoRenewalGracePeriodExpirationDateISO = 'grace_period_expires_date'
const autoRenewalGracePeriodExpirationDateUNIX = 'grace_period_expires_date_ms'
const autoRenewalInBillingPeriod = 'is_in_billing_retry_period'
const autoRenewalOfferCodeName = 'offer_code_ref_name'
const autoRenewalPriceConsentStatus = 'price_consent_status' //if a user was notified about a price increase - only present if they've seen a warning

module.exports = {
    

};

//Debugging key values
// console.log('Receipt - Type: ' + receipt[receiptType])
    // console.log('Receipt - appItemId: ' + receipt[appItemId])
    // console.log('Receipt - appVersion: ' + receipt[appVersion])
    // console.log('Receipt - downloadId: ' + receipt[downloadId])
    // console.log('Receipt - receiptDataKey:' + receipt[receiptDataKey])
    // console.log('Receipt - originalAppVersion: ' + receipt[originalAppVersion])
    // console.log('Receipt - originalPurchaseDateISO: ' + receipt[originalPurchaseDateISO])
    // console.log('Receipt - originalPurchaseDateUnix: ' + receipt[originalPurchaseDateUnix])
    // console.log('Receipt - receiptCreationDateISO: ' + receipt[receiptCreationDateISO])
    // console.log('Receipt - receiptCreationDateUnix: ' + receipt[receiptCreationDateUnix])
    // console.log('Receipt - receiptRequestDateISO: ' + receipt[receiptRequestDateISO])
    // console.log('Receipt - receiptRequestDateUnix: ' + receipt[receiptRequestDateUnix])

    // console.log('Latest Purchase Info:')
    // console.log('Latest - latestReceiptPurchaseDateISO: ' + latestReceiptPurchaseData[latestReceiptPurchaseDateISO])
    // console.log('Latest - latestReceiptPurchaseDateUnix: ' + latestReceiptPurchaseData[latestReceiptPurchaseDateUnix])
    // console.log('Latest - latestReceiptCancellationDateUnix: ' + latestReceiptPurchaseData[latestReceiptCancellationDateUnix])
    // console.log('Latest - latestReceiptCancellationDateISO: ' + latestReceiptPurchaseData[latestReceiptCancellationDateISO])
    // console.log('Latest - latestReceiptCancellationReason: ' + latestReceiptPurchaseData[latestReceiptCancellationReason])
    // console.log('Latest - latestReceiptExpiresDataISO: ' + latestReceiptPurchaseData[latestReceiptExpiresDateISO])
    // console.log('Latest - latestReceiptExpiresDataUnix: ' + latestReceiptPurchaseData[latestReceiptExpiresDateUnix])
    // console.log('Latest - latestReceiptIsIntroOfferPeriod: ' + latestReceiptPurchaseData[latestReceiptIsIntroOfferPeriod])
    // console.log('Latest - latestReceiptIsTrialPeriod: ' + latestReceiptPurchaseData[latestReceiptIsTrialPeriod])
    // console.log('Latest - latestReceiptOriginalPurchseDateISO: ' + latestReceiptPurchaseData[latestReceiptOriginalPurchseDateISO])
    // console.log('Latest - latestReceiptOriginalPurchseDateUnix: ' + latestReceiptPurchaseData[latestReceiptOriginalPurchseDateUnix])
    // console.log('Latest - latestReceiptProductId: ' + latestReceiptPurchaseData[latestReceiptProductId])

    // console.log('Pending Renewal Info:')
    // console.log('Product ID: ' + renewalInfo[autoRenewalProductId])
    // console.log('Renewal Status: ' + renewalInfo[autoRenewalStatus])
    // console.log('Expiration Intent: ' + renewalInfo[autoRenewalExpirationIntent])
    // console.log('Renewal Grace Period Exp date ISO: ' + renewalInfo[autoRenewalGracePeriodExpirationDateISO])
    // console.log('Renewal Grace Period Exp date Unix: ' + renewalInfo[autoRenewalGracePeriodExpirationDateUNIX])
    // console.log('Renewal In In Billing Period: ' + renewalInfo[autoRenewalInBillingPeriod])
    // console.log('Renewal Code Name: ' + renewalInfo[autoRenewalOfferCodeName])
    // console.log('Renewal Price Consent Status: ' + renewalInfo[autoRenewalPriceConsentStatus])