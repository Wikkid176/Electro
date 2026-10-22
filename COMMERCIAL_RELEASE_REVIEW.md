# ElectroLessonLab: US commercial-release rights audit

Audit: October 22, 2026. App: 0.5.1-beta.5. Audited source: `7c052b30d9c7a9b1ce479d58cdff2b7532d57171`. Intended customers: US individual learners and employers. [Launch and pricing guide](docs/PRICING_AND_LAUNCH.md).

**Decision: monetization is feasible in principle, but this audit does not clear the current beta for paid public release.** I found no blanket commercial-use prohibition in the declared licenses of the JavaScript actually bundled. Ownership of reference-informed material, the project's public license scope, native dependency obligations, brand clearance and commercial release policies remain open. This is a technical rights screen and business plan, not a legal opinion or permission from a rights holder. No license, account, billing flow or store listing was changed.

## Ownership follow-up

The [item 1 ownership/licensing packet](docs/ownership/README.md) is now prepared, including license-history evidence, an itemized register, a source-use/app-ownership request and counsel-ready draft materials. It does not resolve owner authority, confer source permissions or apply new licensing terms.

## Findings by priority

| Priority | Finding | Evidence and action |
| --- | --- | --- |
| High | Employer/source rights have not been established | Uploaded manuals and private prints being absent from the APK is good; it does not resolve employment ownership, confidentiality, contract restrictions or protected expression in adaptations. Confirm who owns the app/course and whether reference use was authorized. Have a US IP lawyer review employment/IP agreements and any source permissions before selling. |
| High | Project licensing and exclusivity are unresolved | Root `LICENSE` is Expo/650 Industries' MIT license; it is already published with the project. MIT permits charging, but also allows others to use, modify and redistribute covered software subject to its conditions. It does not establish your ownership of all training material. Preserve the Expo notice. Decide and document the scope of your original code/content/assets with the legal owner; do not assume removing MIT now revokes rights already granted. |
| High | Native license closure is incomplete | The earlier notice bundle is mostly npm-derived. This audit identifies 133 resolved Android runtime coordinates and 18 ARM64 shared libraries. Cached POMs lack explicit license information for 11 coordinates; some inherit it or are locally generated. Native C/C++ and transitive notices/source requirements need a per-component review. Missing metadata alone is not proof of infringement. |
| High | An actual shipped MPL-covered data resource needs review | The APK includes OkHttp's `publicsuffixes.gz` and its notice identifying the Public Suffix List and MPL-2.0. Validate how recipients obtain the corresponding source for the shipped version, preserve the notice/license, and pin the source/release reference. This is a covered-component obligation; it does not automatically require publishing the entire app's proprietary source. Existing upstream notice/source links may satisfy some requirements, but their adequacy/version correspondence was not verified. |
| Medium | ELL / ElectroLessonLab / Click are not cleared brands | No live federal, state, common-law, app-store, domain or character-similarity clearance was possible. Search exact, phonetic and related-service names, with software/education categories and intended territories. A generic acronym or no exact match does not establish availability. Do not claim NFPA or another organization approves the product. |
| Medium | Generated artwork has a provenance trail, not guaranteed exclusive copyright | Click, component graphics and logo sources/hashes are recorded. New logo references are the project's own preceding graphics. Review applicable OpenAI service terms and input rights; current terms could not be retrieved. US copyright generally requires human authorship, so purely generated elements may have limited/no copyright protection. Human contributions and trademark rights are separate questions. Retain design records and consider a commissioned human refinement with a signed rights assignment if exclusivity matters. |
| High for launch | Commercial policy and safety-review work is unfinished | No in-app legal/OSS viewer, public privacy policy, consumer terms, Play billing/paywall or employer licensing/admin system was found. Current APK is a beta, not a Play production bundle/listing. Qualified electrical-content review and physical-device testing remain outstanding. Do not market game completion as certification, OSHA/NFPA approval, CE credit, professional qualification or measured human learning effectiveness. |

## What was actually checked

- **Current npm tree:** 518 lockfile package locations; 501 installed. All name/version pairs appear in the earlier inventory, but that inventory alone does not settle shipped obligations. Declared licenses are predominantly MIT/ISC/BSD/Apache; 12 MPL locations and one CC-BY location also exist in the full toolchain.
- **Actual Android JavaScript scope:** the release Metro map identifies 29 package name/version pairs, declaring 28 MIT and one ISC. MPL Lightning CSS, CC-BY caniuse-lite and dual BSD/GPL node-forge were not identified as Android JavaScript sources. Their presence in build tooling is not proof that the app must become GPL or that those packages are shipped. A future web distribution needs its own asset/data review.
- **Notice gaps:** 43 installed npm locations lack a matching top-level license/notice file. This includes boolbase, whose externally obtained ISC notice is already bundled. Five locations occur in the release JS package set: four React Native subpackages and metro-runtime. Check applicable source headers/enclosing repository licenses rather than calling them unlicensed. Preserve all applicable copyright and permission notices.
- **Android/native scope:** 133 resolved runtime coordinates from offline Gradle resolution, plus cached Maven license declarations. The graph can include constraints/metadata and does not prove every artifact's code survives shrinking. It also does not enumerate every statically incorporated C/C++ component. Review React Native/Hermes/Fresco/fbjni, OkHttp/Okio, AndroidX, compression/image libraries, C++ runtime and any incorporated upstream code. POM declarations are leads, not complete license texts or a finished SBOM.
- **APK:** signature identity is tied to SHA-256 `a544637b90e84d9e1a5f4ccca877e2a8231145fca533d27095453275b668ea1f`. The archive contains exact copies of the current root license and 769,909-byte third-party notice bundle. No PDF/DOC/DOCX/PPT/PPTX reference documents, private signing files, or bundled font files were found. System font references do not distribute a separate font file.
- **Reachable Git history:** no tracked files matching the checked reference-document or private signing formats were found. This does not inspect third-party hosting caches, unreachable objects or every possible secret representation.
- **Fresh content screen:** extracted text from all 26 separately supplied documents, including DOC/DOCX bodies and PPT text atoms, and screened 49 app source files for normalized exact 14-word windows. No matches were found. No source excerpts are included in this report. The two initial ZIP uploads were not part of this fresh 26-file screen. Embedded images/OCR, close paraphrase, substantial similarity, distinctive selection/arrangement and trade secrets are outside this test.
- **Asset provenance:** current recorded hashes matched. The source code and models use general electrical teaching concepts and original layouts; no checked provider name or private print identifier was found in app source. This is not a visual similarity or patent freedom-to-operate opinion.

Evidence: [inventory summary](docs/commercial-audit/inventory-summary.json), [bundled JS](docs/commercial-audit/bundled-js-packages.json), [Android runtime](docs/commercial-audit/android-runtime-dependencies.json), [APK scope](docs/commercial-audit/apk-scope.json), [fresh text screen](docs/commercial-audit/content-screening.json), [audit manifest](docs/commercial-audit/audit-manifest.json).

## What commercial licensing should look like

1. Establish the owner: you personally or your company, with contributor/contractor assignments and any employer release/permission that is actually required. An LLC does not acquire copyright merely because you create it; document assignments into it where appropriate.
2. Separate applicable third-party notices from your own terms. Keep the existing MIT text for covered Expo/scaffold code; do not replace third-party notices with an “all rights reserved” label. Have counsel clarify what prior project licensing already granted before adding prospective terms for genuinely owned original contributions. Proprietary terms cannot cancel recipients' open-source rights.
3. For every shipped component, retain applicable license/copyright/NOTICE text and satisfy source/access obligations where they apply. Dual licensing may permit an appropriate permissive option; it does not automatically force the GPL alternative. MPL is generally file/component scoped, not blanket application copyleft. The exact files, modifications and distribution model determine obligations.
4. Add a reachable **About → Legal / Open-source notices** view, a public policy URL and a support contact. Embedded notice assets are verified; a user-facing legal view was not found. An OSS viewer improves access but does not replace license-specific source duties.
5. Define consumer/employer license rights, seat assignment, updates, refunds and support. Do not promise lifetime updates, official certification, or enterprise reporting that the current app does not provide. Previously delivered beta copies and already granted licenses cannot simply be erased by a new price or paywall.

## Reference and standards policy for a paid product

General principles and independently expressed explanations can be taught commercially; possession of a document does not grant republication rights. Avoid source pages, screenshots, figures, copyrighted tables, copied questions, private machine layouts, identifiable tags and close expressive adaptations unless a license/permission actually covers them. A private employer process can remain confidential even after changing its wording or deleting a logo. Assess the right to use the reference, not just the right to redistribute the PDF.

Keep NFPA/UL references descriptive and accurate, with the relevant editions and limitations reviewed by a qualified specialist. Do not use organization logos or endorsement/certification claims without authority. Do not turn a historical 2009 presentation or site-specific procedure into a claim of current compliance. A disclaimer does not cure copied content, a false claim or inaccurate instruction.

## Privacy and employer customers

Current training/study data is local, with manual sharing and no detected app backend or analytics/billing SDK. Codes and free-text feedback can still be personal data when an organizer/employer can link them to someone. Do not label the whole study anonymous. A commercial privacy policy and Play declarations must reflect the final app, SDKs, purchases, diagnostics and user-initiated exports; reassess them after monetization is implemented.

Specify employer access, purpose, retention/deletion and employee communications before collecting identifiable progress. The beta record is a research/testing tool, not an employer LMS or proof of competency. If you later process employer data on their behalf, assess security and contractual/data-processing requirements for that service.

Decide the actual age audience. Under-13 child-directed use/actual knowledge can raise COPPA obligations; not every app used by a teen is child-directed. Play Families/target-audience rules and state privacy rules need review. Do not solve this with an inaccurate age declaration or a generic checkbox.

## Commercial-release gate

Before charging for public release, close these items with evidence:

- Ownership/permissions and chosen project-license scope recorded.
- Native + JS notices/source-obligation matrix reviewed; MPL resource source path verified for the shipped version.
- Name/mascot searches and any needed professional clearance completed.
- Independent electrical-content review and real Android test results completed; marketing claims limited accordingly.
- Consumer/employer terms, privacy/support pages, accessible OSS notices and required Play declarations completed.
- Production package/signing decision, current Play technical requirements, billing/entitlement flow and approved distribution tested.
- Actual customers validate usability and willingness to pay; synthetic beta results are not human evidence.

This audit has not selected a legal owner, rewritten the license, obtained permissions, filed a mark, created a company, enrolled a developer account or published a paid listing.

## Official verification sources and access limitation

Fourteen official/market HTTPS requests were attempted in this audit; all were blocked by proxy CONNECT 403. [Request log](docs/commercial-audit/research-access.json). Consequently, current competitor prices, mark registrations, OpenAI contract text and 2026 Play policy changes were not verified. The links below are for manual verification, not evidence of a successful current search:

- [US Copyright Office: AI](https://www.copyright.gov/ai/) and [works made for hire](https://www.copyright.gov/circs/circ30.pdf).
- [USPTO trademark searching](https://www.uspto.gov/trademarks/search).
- [OpenAI terms](https://openai.com/policies/terms-of-use/); check the actual agreement governing your account/service.
- [Play account setup](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en), [personal-account testing](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en), [fees](https://support.google.com/googleplay/android-developer/answer/112622?hl=en), [pricing](https://support.google.com/googleplay/android-developer/answer/6334373?hl=en), [user data](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en), [payments](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en).
