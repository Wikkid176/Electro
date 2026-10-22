# ELL: independent US developer launch and pricing plan

October 22, 2026. US-first Android launch, individual learners and employers. Read [the rights audit](../COMMERCIAL_RELEASE_REVIEW.md) before selling. Prices below are recommendations to validate, not verified competitor benchmarks or a valuation.

## Recommended offer

| Customer | Recommended starting offer | Conditions |
| --- | --- | --- |
| Individual | **$29.99 one-time** for the complete current course | Start at **$19.99** for a clearly dated introductory period, then use the stated regular price. No recurring fee for the existing offline experience. Define update/support terms; do not promise unlimited lifetime future courses. |
| Prospective learner | Free sample: first three safety lessons and one introductory wiring activity | Proposed product work, not implemented. Paid unlock must be enforced through a tested entitlement flow. Keep the sample safety explanations complete rather than paywalling essential warnings mid-activity. |
| Employer | **$249 pilot for up to 10 named learners**, with eight weeks of manual onboarding/feedback support | Proposed paid pilot after release gates and delivery terms are ready. Define whether the current-course licenses persist after support ends; recommended yes. Sell only what can be delivered. No admin dashboard, SSO, LMS/SCORM, automatic supervisor reports, accreditation or compliance certification is included. |

The current app contains 47 lessons, three quizzes per lesson, five labs and a scripted coach. It has no recurring AI inference feature or live tutoring service that alone justifies a subscription. Start with a one-time purchase. Add a subscription only if you deliver and maintain continuing value such as new reviewed courses, real instructor/admin features or a supported reporting service; validate demand before setting that price.

Do not begin with a complex consumer subscription and enterprise SaaS simultaneously. Launch the individual offer first while conducting a small, manually supported employer pilot. The pilot price buys a defined learning product and support, not a claim of competency. Public beta APKs already include the whole course without a paywall; a future store price will not revoke those copies. Plan the paid production version and communicate the beta transition honestly.

A free Play app with a one-time full-course in-app purchase is the preferred eventual acquisition model. A simpler paid-upfront Play app is an alternative if you want to avoid building a free-sample entitlement system first; it has more purchase friction. Verify current rules before choosing: historically, a Play listing released as free cannot simply be converted to paid-upfront on the same package, while allowed in-app purchases are a separate model. Do not publish free on Play and assume you can change that decision later.

## Pricing economics

At $29.99, an illustrative 15% store fee leaves **$25.49 per copy**; at 30%, **$20.99**. These are receipts before taxes, refunds, support, review, marketing, development and other costs, not profit. The actual service fee depends on program enrollment, product/transaction type, territory and current policy. No 2026 fee rate was verified in this environment.

| Price | Receipts/copy at assumed 15% | Receipts for 100 paid copies at assumed 15% |
| --- | ---: | ---: |
| $19.99 | $16.99 | $1,699.15 |
| $29.99 | $25.49 | $2,549.15 |
| $39.99 | $33.99 | $3,399.15 |

For an illustrative $1,500 fixed launch budget, $29.99 requires 59 copies at a 15% fee or 72 at a 30% fee, before other costs. This is a break-even arithmetic example, not a forecast or a suggested sufficient legal/review budget. Use [the pricing CSV](commercial-audit/pricing-model.csv) to compare volumes and fee assumptions. Employer sales may use a different permitted distribution/billing arrangement; these consumer-store calculations should not be applied blindly.

## Validate the price with customers

1. Finish native usability and independent content review first. Keep the current closed beta free.
2. Interview at least 10 likely individual buyers and 3 employer training decision-makers. Ask what they pay for now, what problem ELL solves, what they would replace and what would block purchase. Professionals, beginners, parents and employer buyers have different purchase motives.
3. Test clearly presented $19.99, $29.99 and $39.99 offers with comparable audiences and the same product description. Do not charge different amounts without disclosing the offered price. A small beta cannot establish statistical confidence; use it for discovery, not a claim that 12 people predict the market.
4. Prefer real purchases at a disclosed price over hypothetical “would you pay” answers. Before selling, present a truthful preview and accurate delivery/refund terms; do not sell a fake checkout for an unavailable product.
5. Measure conversion, refunds, time-to-first-lesson, first-week return, first-attempt completion, support minutes per purchaser and employer willingness to renew/expand. Your existing local beta metrics and synthetic profiles do not measure paid conversion or learning effectiveness.
6. Keep $29.99 if buyers see value and support economics work. Test $39.99 only after quality and outcomes justify it; reduce onboarding friction before discounting the entire product. Introduce recurring employer pricing only after recurring features/support and demand are established.

Competitor research still needed: compare EveryCircuit for consumer electrical simulation, Electrician Simulator for entertainment interaction, and Interplay/TPC for employer trade training. Their products serve different needs. Record actual current US checkout prices, purchase type, platform, scope, instructor/admin features and date. None of their current prices was verified in this audit; the recommendation is based on ELL's present scope and a pricing experiment, not invented market averages.

## Step-by-step independent developer launch

### 1. Establish ownership and business identity

Start by resolving employer/reference rights and the published MIT scope in the audit. You can operate as a US sole proprietor; an LLC is optional, not a prerequisite to publish an app. An LLC can help organize business separation but does not erase personal responsibility for your own conduct or cure IP problems. Get state-specific advice about entity/DBA registration, local business requirements and insurance appropriate to an industrial-training business. Consider a separate business bank account and bookkeeping from the start. Confirm tax ID/EIN needs with your bank/accountant; an IRS EIN application is free through the IRS when applicable.

Choose the seller/developer name, support email/domain and business address/contact arrangements before developer enrollment. Store identity verification and what becomes public matter, particularly for paid merchant accounts. An organization account generally has entity-verification requirements different from a personal account. Do not invent an organization to avoid verification.

### 2. Close the product/legal gates

Arrange a focused IP/contract review and an independent qualified electrical-content review. Clarify your rights to source-informed content and your original brand/assets. Preserve third-party notices and close native source obligations. Prepare privacy, consumer/employer license terms and support/refund information reflecting the actual product. Add accessible in-app legal notices. Choose the age audience truthfully and handle employee/teen testing appropriately. These documents and reviews are not replaced by a “simulation only” disclaimer.

### 3. Choose production identity and purchase model

The current package ends in `.beta`. Decide a permanent production package before creating its store listing. Keeping the existing package can permit updates when correctly signed; a new production package is a separate app and will not automatically inherit beta local data. If you choose a separate package, plan explicit consent-based progress migration instead of promising a seamless update.

Choose paid-upfront versus free-sample/full-unlock before publishing. For an in-app unlock, implement eligible Google Play Billing, durable entitlement checking/restoration and offline behavior appropriate to an offline course. Design refunds/revocations and reinstall/device-change handling. Test genuine production-like purchase states. The current app has none of this. Employer licensing/distribution must also be workable and permitted; do not sell ten seats before you can provide ten valid learner entitlements.

Do not add external payment prompts or B2B checkout links inside a Play app without checking the current payments policy and any applicable US/enterprise exceptions. Region-specific alternatives and court-driven policy changes make blanket rules unreliable. No payment provider, account or checkout is configured by this plan.

### 4. Enroll and run the required store testing

Create a Google Play Console account with the correct personal/organization identity and complete verification. The historically published registration charge is US$25 once; verify the current enrollment amount directly before paying. New personal accounts have commonly needed a closed test with at least 12 opted-in testers for 14 continuous days and a production-access application. Verify the current requirement shown for your account; it was not retrievable here. Installing our sideloaded APK does not count as opting into a Play closed test. The 12 planned human testers may help only if eligible and actually participating through the required Play track. Organization enrollment should match a real organization, not be used as a testing-policy workaround.

### 5. Prepare a production AAB and complete the listing

Keep the signing key protected. Configure Play App Signing/upload-key arrangements deliberately, generate a release Android App Bundle, and meet the current target API, native-library/page-size, permission and other technical requirements shown by Play Console. The APK is already signed, non-debuggable and 16 KiB-alignment checked, but that does not validate a new AAB or all current Play policies.

Prepare accurate store text, screenshots from the real app, the Click icon/feature graphic, support and privacy URLs, content rating, target audience, ads declaration, app-access information and Data safety responses. Describe concepts and practice; do not claim qualification, certification, official endorsement or unmeasured human outcomes. Make clear which content is free and paid. Complete merchant/payout/tax setup and test the selected price/localization. A developer who prefers to stay independent can do this personally; a publisher or agent is not required.

### 6. Launch gradually and support it

Run closed testing on real Android devices, including launch, lessons, probes/wires, save/restore, purchases, refunds, offline use, accessibility, readable graphics and manual sharing. Fix failures and collect documented reviewer sign-off. Apply for production access where required. Start a small release and monitor crashes/ANRs, support, refund reasons and confusing lessons before expanding promotion. Keep content/version records, buyer/support records and a process for correcting safety-relevant errors.

For employer pilots, agree seats, permitted distribution, support period, data access and deletion in writing. Use only reporting you can actually provide, with appropriate employee notice/consent and confidentiality. Do not repurpose pseudonymous research data into employment decisions without an agreed lawful process.

## First actions

This week: resolve ownership/permissions; book one IP/contract review and one qualified content review; decide seller identity and pricing model; contact individual and employer prospects for discovery. Next: complete legal/native attribution work, build the chosen purchase/distribution flow and prepare the production bundle/listing. Then conduct Play-required and real-device tests before charging the public. No completion date is promised until those prerequisites are known.

Official links for manual checks: [Play account setup](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en), [testing](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en), [pricing](https://support.google.com/googleplay/android-developer/answer/6334373?hl=en), [fees](https://support.google.com/googleplay/android-developer/answer/112622?hl=en), [payments](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en), [SBA business structures](https://www.sba.gov/business-guide/launch-your-business/choose-business-structure), [IRS self-employed tax center](https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center). These links are not evidence that current policy was fetched successfully.
