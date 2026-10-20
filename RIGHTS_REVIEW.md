# Material and software rights review — preliminary

October 19, 2026. Scope: the current local prototype, its source and bundled artwork, the 26 available extracted reference texts, and dependency metadata. This is a documented screening exercise, not a legal clearance or a guarantee that no third-party right applies. Intended launch jurisdictions and final distribution terms remain unspecified.

## Findings and actions

| Area | Finding | Action/status |
| --- | --- | --- |
| Proprietary references | Uploading a file does not itself establish a right to redistribute it. The source set includes private drawings, employer-specific guides, publisher course material, and standards-related material. | Reference files/extracted text remain outside the checkout. No original pages, embedded figures, machine layouts, source identifiers, or provider branding were imported into the app. Preserve that boundary. |
| Lesson wording | A normalized exact 14-word-window comparison of app source against all 26 extracted texts found no matching windows. | Machine-readable scope/results in `docs/rights-text-screening.json`. This is a narrow text-copy screen; it does not assess substantial similarity, selection/arrangement, concepts versus expression, images, contracts, or trade secrets. It is not proof of originality or permission. |
| Standards references | The app names NFPA/UL subjects for general scope teaching; source standards text, tables, and authoritative code decisions are not reproduced. | Avoid implying endorsement, certification, or that summarized source rules establish current requirements. Review applicable licensing and source usage if actual tables/text are added. |
| Generated artwork | Component and coach sheets were generated from descriptions without supplying private prints, competitor assets, or an existing mascot image as image references. Visual checks found no intentionally added manufacturer/provider marks. | Treat them as illustrative game assets. Generation does not guarantee non-infringement, exclusive ownership, or full copyright protection. Similarity/trade-dress and generated-detail review remain human release tasks. |
| Sparky/name choice | Known NFPA mascot association is a reason for caution in nearby safety-education branding; formal/current checks are blocked. | Avoid publishing Sparky as this character's identity for now. Coach Click and the app title are provisional. See `BRAND_AND_MARKET_REVIEW.md`. |
| Root license | Existing `LICENSE` is the Expo/650 Industries MIT notice. It should be retained for applicable scaffold code. It does not document ownership or permission for uploaded training documents, or settle the user's intended terms for new material. | Original file preserved unchanged. Removed broad documentation language that could imply third-party software is newly authored here. Project owner must settle project licensing before release; this review does not silently relicense the project. |
| Dependencies | Lockfile inventory contains 505 package records; 488 are installed in this machine. Declared licenses include MIT/ISC/BSD, Apache-2.0, MPL-2.0, CC-BY-4.0, and dual alternatives. | Saved `docs/dependency-licenses.json` and collected 451 installed license/notice files in `THIRD_PARTY_NOTICES.txt`. Inventory covers tooling as well as dependencies; it is not a measured list of what every final binary ships. |
| Missing notice files | 42 installed package locations lack a top-level license/notice file matching the scan patterns; names can repeat at nested locations. This is not evidence that they are unlicensed or infringing. | Review inventory entries and `docs/dependency-notice-gaps.json`; check embedded headers, repository/package notices and final distribution requirements. Do not invent or strip notices. |
| Attribution and license obligations | CC-BY metadata occurs for caniuse-lite; MPL-2.0 occurs for Lightning CSS packages; node-forge offers BSD-3-Clause OR GPL-2.0. | Determine actual distributed material and preserve applicable attribution/license/source obligations. A dual BSD/GPL declaration is not an automatic requirement to license this app under GPL. Unlicense entries were not treated as prohibited. |

## Generated asset provenance

`docs/asset-provenance.json` records current generated asset hashes, purposes, and generation context. The component atlas has 16 operating-state images and four defect variants; the coach has four poses. Original output PNGs were copied unchanged into app assets, with framing performed at render time. There is no claim that the stylized equipment is an exact model or a field-service illustration.

Earlier prototype bolt/icon assets were visually inspected and match the prototype's own generic bolt motif, including the unused splash asset. This is not an independent worldwide image-similarity search. Framework/template and third-party license notices remain separate from new training copy and generated graphics.

## Before public release

1. Verify launch territories, trademark/name conflicts and similarity to existing mascots using accessible official and market sources. Resolve commercial branding before changing store identity or commissioning a final brand system.
2. Confirm the intended software/content license and project ownership/assignment records. Keep uploaded material private unless the rights holder separately permits its distribution.
3. Determine the licenses/notices and any source obligations applicable to the actual released web/native packages, including attribution where applicable. The collected notice file is an audit artifact, not proof of complete distribution compliance.
4. Have a qualified reviewer assess close paraphrases, expressive similarity, artwork/trade dress, contractual confidentiality, and any proposed excerpts. A 14-word test cannot replace that review.
5. Review current copyright-office guidance for generated assets and human-authored contributions in the relevant jurisdiction. The [US Copyright Office AI page](https://www.copyright.gov/ai/) was blocked in this environment, so no fresh official guidance was retrieved here.

Official live app-store, trademark, mascot, and copyright-source verification was blocked by the environment's HTTP 403 network policy. A targeted network-access draft has been saved for review; those checks remain incomplete until access is activated.
