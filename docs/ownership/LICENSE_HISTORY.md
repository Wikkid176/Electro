# Recorded license history and what it means

The available repository is not shallow. The root license first appears in commit `f060705a676bd5489a795f369a0c74d9bd6dcd2d`, October 20, 2026. Its tracked bytes have not changed. It is the MIT license with the notice `Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)`.

There is no package-level `license` field. `package.json` has `private: true`; this prevents ordinary npm publication, but it does not make the GitHub repository private or establish a proprietary copyright license. Source and APK versions have already been published. The commercial audit verified that GitHub served the root license without an Authorization header supplied by the audit request.

No signed employer release, human contributor assignment or reference-source permission was found in repository files. Such agreements may exist privately; the repository cannot prove their absence outside it. Commit author names identify Git records, not legal rights holders. “Project-owned” in earlier graphics-provenance prose describes production provenance and is not a signed assignment or a legal ownership finding.

## Conclusions supported by this evidence

- MIT expressly allows commercial sale of covered software when its conditions are respected. Monetization does not require making all code proprietary.
- The notice's existence does not prove that Expo owns the newly created course or that the developer owns all uploaded references.
- The intended scope of a root MIT file in a published mixed-origin repository needs review. Do not assume it applies only to a tiny scaffold, or conclusively to every file, without reviewing the publication context and applicable rights.
- If valid MIT rights were granted in prior versions, a later notice cannot simply revoke those grants. Previously received copies/versions and third-party rights need explicit preservation.
- A future license can address rights the actual owner holds in applicable new contributions. It cannot override third-party licenses, assign an employer's rights without authority, or manufacture human-authored copyright where none exists.

## Proposed implementation after the facts are resolved

1. Keep the original Expo MIT text and all applicable dependency notices.
2. Identify actual owners and file/content categories; confirm what existing grants already cover.
3. Choose either an explicitly scoped open-source continuation or counsel-reviewed prospective commercial terms for eligible original material. Consider leaving existing MIT-covered code open and distinguishing genuinely new content/service offerings if prior rights make that clearer.
4. Add a scope document listing inherited/third-party material, prior grants, and the particular future original contributions covered by new terms. Use an effective release/date established after review.
5. Only then update package metadata or operative project terms, without representing a draft as effective or deleting historical license evidence.

Root license and notice hashes, first commit and review basis are recorded in [history-evidence.json](history-evidence.json). The underlying app version remains 0.5.1-beta.5.
