# MES privacy: internal checklist and LIA draft

Prepared 9 October 2026. Internal working document, not the public privacy notice
and not a completed compliance assessment. No account settings were accessed or
changed. A passing website build does not establish legal compliance.

## Confirmed by the owner

- Controller: Muslim Entrepreneurs Society (MES), an independent student society
  at Manchester Metropolitan University. Contact: mmu.mes@outlook.com.
- Live website: https://mmumes.com, hosted on Vercel. No MES visitor analytics,
  accounts, application database, advertising/tracking scripts or custom payments.
- Recruitment: Tally form https://tally.so/r/ob4kAb. Name, email, course, study year,
  preferred team, skills/experience, motivation, ideas, availability and voluntary
  answers. No explicit questions about religion, ethnicity, health or disability.
- Only the Operations Lead and President (Asma) review applications. Tally is
  registered to the Operations Lead's personal email; submitted application
  notifications arrive there. Relevant applications are manually shared with the
  President. Do not record the private email address in this repository.
- Partial submissions enabled; save answers for later disabled; email
  notifications enabled; no external integrations, including Google Sheets.
  Moving future forms to the official Outlook mailbox is an intention, not the
  present arrangement. Website edits do not change the standalone Tally form.
- Outlook enquiries can include names, addresses, messages and voluntary
  attachments. Social services are external links, not embedded login systems.

## Legitimate interests assessment — draft for decision

Proposed basis: UK GDPR Article 6(1)(f), ordinary legitimate interests. Do not
represent this as a signed assessment or use the separate recognised legitimate
interest basis without grounds.

| Processing | Purpose | Necessity to assess | Balance and provisional view |
| --- | --- | --- | --- |
| Submitted committee applications | Recruit suitable members, assess roles, contact applicants, arrange interviews and manage recruitment | Contact details and relevant role information help assessment; check each question is proportionate and whether less data would suffice | Applicants ordinarily expect recruitment review. Two reviewers and short retention reduce exposure. Article 6(1)(f) appears suitable for ordinary information, subject to documented assessment of actual safeguards and sensitive information. |
| Partial answers before Submit | Currently captured within recruitment | **Not established:** show why capturing abandoned answers is necessary when submitted applications are a less intrusive alternative | Unexpected capture, unintended sensitive disclosures and lack of a completed application weigh against it. A disclosure alone does not establish necessity or fairness. Do not treat an abandoned form as permission for follow-up. Determine actual use and justify this separately; if it fails the test, obtain owner approval to change the setting. |
| Enquiries | Respond to and resolve messages | Names, contact details and relevant message content enable replies; minimise attachments and circulation | Correspondents expect a reply. Article 6(1)(f) appears suitable for ordinary enquiries subject to access and retention controls. |
| Necessary website technical information | Deliver and protect a functioning site | Confirm the technical data retained by Vercel and any MES access to logs; avoid optional tracking | Limited delivery/security processing appears suitable for legitimate interests. Check provider purposes and retention separately. |

Assumptions to verify: no reuse for marketing, no recruitment scoring automation,
and no contact with abandoned applicants unless separately justified. Consider
under-18 applicants if possible; do not assume every university student is an
adult. For successful applicants, identify precisely which information remains
necessary during membership; this notice is not a basis for unrelated new uses.

- [ ] Operations Lead and President complete and record purpose, necessity and
  balancing decisions, actual safeguards, approver and date. Review when purposes
  or arrangements change. Assess high-risk processing and whether a DPIA is needed.
- [ ] Assess free text, attachments and the religious-society context. Ordinary
  fields can reveal special category information; do not infer beliefs or
  discriminate from names or an application. If information reveals beliefs or
  health, identify a valid Article 9 condition in addition to Article 6 before
  processing it. Do not assume voluntary disclosure is explicit consent, or that
  Article 9(2)(d) automatically covers all prospective applicants and sharing.
  Set a procedure for minimising/redacting unnecessary sensitive content and
  handling necessary adjustments. No Article 9 condition is asserted here.

The reasoning above follows the [ICO's three-part test and LIA guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/legitimate-interests/how-do-we-apply-legitimate-interests-in-practice/)
and [guidance on special category information and inferences](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-is-special-category-data/).

## Access, contracts and international processing

- [ ] Record who acts for MES as controller, who owns privacy requests and how
  committee handovers work. Verify official-mailbox access; application review
  access is confirmed, enquiry-mailbox permissions are not.
- [ ] Verify permissions, MFA where available, confidentiality, secure sharing,
  device/download access and removal of former committee members. Inventory the
  reviewers' email providers privately, notification content and shared copies.
- [ ] Check service roles and terms applying to the actual accounts and plans.
  Tally describes itself as processor for form responses and publishes a DPA,
  but account creation under a personal email is not proof that MES has entered
  an appropriate Article 28 arrangement. Record who accepted terms for MES and
  confirm coverage. Verify Vercel and Outlook arrangements; do not assume a
  consumer Outlook account has enterprise processor terms. No executed DPA is
  claimed by the public notice.
- [ ] Map actual international transfers and applicable protections. Tally
  documents European form storage and US SendGrid processing for enabled email
  notifications. This is a Tally subprocessor, not an MES form integration.
  Vercel and Microsoft describe global processing, including the US; reviewer
  email providers remain to be verified. Record relevant destinations,
  recipients, UK adequacy where applicable, or an applicable UK transfer
  mechanism and any required assessment. An EU SCC alone is not proof of a
  compliant UK arrangement. Give requesters information about applicable
  protections and how to obtain a copy; update the notice when verified.

Provider sources: [Tally GDPR and subprocessors](https://tally.so/help/gdpr),
[Vercel privacy notice](https://vercel.com/legal/privacy-notice),
[Vercel published DPA](https://vercel.com/legal/dpa),
[Microsoft privacy statement](https://www.microsoft.com/en-gb/privacy/privacystatement).
Vercel's published DPA references Enterprise provision; check the actual plan
instead of assuming it applies. Use the [ICO transfer guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-brief-guide-to-international-transfers/)
to evaluate MES's arrangements. Provider documents are not evidence that
account-specific safeguards have already been verified.

## Manual deletion procedure

The owner has adopted these deadlines:

| Record | Deadline |
| --- | --- |
| Unsuccessful application | Within 3 months after recruitment closes |
| Successful application | Keep only information needed during membership; delete within 3 months after it ends |
| Incomplete/partial application | Within 30 days after recruitment closes |
| Email enquiry | Only as needed, normally no longer than 12 months after resolution |

- [ ] Assign responsibility and record recruitment closing dates, membership end
  dates and enquiry resolution dates. Schedule manual reviews sufficiently often
  to meet deadlines, including a review at closure and before the 30-day deadline.
  Delete redundant successful-application information earlier when no longer needed.
- [ ] In Tally, review both submitted and **Partial** entries, select due records
  in Submissions and delete them. Entries remain until manually removed; this
  implementation does not enable automated retention.
- [ ] Check Trash and permanently remove the due records by the deadline.
  Current Tally guidance says all deleted entries first go to Trash and remain
  recoverable for 90 days unless **Empty trash** is used. Inspect the items before
  emptying; that control may include other forms or records. Arrange safe cleanup
  with the account owner, preserving any still-required records outside that
  deletion action. Do not delete the active form or whole workspace.
- [ ] Remove relevant notification emails and forwarded/shared application
  copies from both reviewers' mailboxes, including Sent, Deleted Items/Trash,
  attachments, local downloads and any exports actually created. Check enquiry
  copies similarly. Confirm provider-specific recovery folders and backup
  behaviour; do not promise immediate removal from every backup.
- [ ] Keep a minimal deletion log (category, deadline, deletion date, responsible
  reviewer and confirmation of copy/Trash cleanup), without duplicating answers.
  Check older records now, not only applications received after publication.

[Tally's current deletion guide](https://tally.so/help/how-to-delete-and-recover-form-data)
documents the Trash window and manual emptying. Its
[partial-submission guidance](https://tally.so/help/partial-submissions) confirms
capture without Submit and that partial answers do not trigger notification
emails or integrations. The separate save-for-later feature being disabled
does not switch this capture off.

## Transparency, rights and operational checks

- [ ] Add the text below at the **top of the standalone Tally form, before its
  first answer field**, and publish the form change. Check both direct and
  embedded routes. Do not add a mandatory consent checkbox for legitimate
  interests. Do not change questions or partial-submission settings as part of
  this website update.
- [ ] Audit live embedded/direct-form cookies, storage, requests, custom scripts
  and bot protection without entering applicants' data. Save-for-later is
  disabled, but that does not establish that every third-party resource is free
  of storage. Determine any PECR consent requirements from actual behaviour and
  current rules. Website code has no first-party storage or tracking scripts.
  [Tally form settings](https://tally.so/help/form-settings) and
  [website cookie notice](https://tally.so/help/cookie-policy) are provider
  references, not an audit of this specific form.
- [ ] Establish a privacy-request and complaint process, proportionate identity
  checks and lawful response deadlines. Search Tally, partial entries and all
  relevant mailboxes/copies. Explain applicable exceptions and objection
  decisions. Portability does not ordinarily attach to Article 6(1)(f).
  Preserve the public [ICO complaint link](https://ico.org.uk/make-a-complaint/).
- [ ] Record breach handling, processor contact routes, ICO fee/exemption
  assessment, retention reviews and recordkeeping. No DPO appointment or
  certification is assumed.
- [ ] Review public notice completeness after confirming recipients, provider
  terms and transfers, using the [ICO privacy-information checklist](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/).
  Update the notice and date if the official mailbox migration or other
  arrangements change. An adopted retention policy is not proof that every
  historic copy has been deleted.

## Exact standalone Tally disclosure

Add this text before any answer fields. Make “Privacy notice” a visible link to
https://mmumes.com/privacy.

> Before you start: this form has partial submissions enabled. Tally may collect
> and store answers as you enter them and make them available to Muslim
> Entrepreneurs Society (MES), even if you do not press Submit or finish the form.
> MES uses application information to review committee applications, assess
> suitability, contact applicants, organise interviews and manage recruitment,
> relying on legitimate interests. Only the Operations Lead and President review
> applications; submitted application notifications currently go to the Operations
> Lead’s personal mailbox. Please avoid unnecessary sensitive information.
> Incomplete answers are deleted manually within 30 days after recruitment closes.
> For all retention periods, how information is handled and your rights, read our
> Privacy notice: https://mmumes.com/privacy. Privacy questions or requests:
> mmu.mes@outlook.com.

Approval record: decision maker __________; date __________; LIA outcome
__________; remaining actions and owners __________.
