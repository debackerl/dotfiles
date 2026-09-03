---
name: data-privacy
description: Summary of data privacy regulation applying to software development.
compatibility: opencode
---
# Right to Erasure 

Under **GDPR Article 17**, data subjects have the *right to erasure* ("right to be forgotten"). However, **GDPR Article 17(3)(b)** explicitly provides an exemption: erasure is not required when processing is necessary *"for compliance with a legal obligation which requires processing by Union or Member State law."*

This means businesses must **retain** data when another law mandates it — even if a customer requests deletion. Below is a survey of such laws across five jurisdictions.

When a deletion request comes in, best practice is to:
- **Delete** all data not subject to a legal retention obligation.
- **Restrict processing** of data you must retain (i.e., lock it down so it's only used for the legal purpose).
- **Document** the legal basis for continued retention.
- **Enforce an effective deletion date** for when the retention period expires (i.e. save the logical (soft-) deletion data).

## European Union

| Regulation / Law | Data Type | Retention Period |
|---|---|---|
| **EU VAT Directive (2006/112/EC)** | Invoices, tax records | **6–10 years** (varies by member state) |
| **National Tax Laws** (e.g., Germany: AO §147; France: Code de Commerce) | Accounting books, financial statements | **6 years** (Germany) to **10 years** (Germany for certain accounting records; France for commercial books) |
| **MiFID II (Markets in Financial Instruments Directive)** | Client communications, transaction records | **At least 5 years** (up to 7 for some records) |
| **Anti-Money Laundering Directive (AMLD 5/6)** | Customer due diligence, transaction records | **5 years** after end of business relationship (can be extended to 10) |
| **EU AI Act** | Quality records, conformity declarations, documentation for high-risk AI systems | **10 years** after system placed on market |
| **eIDAS Regulation** | Trust service records (e.g., electronic signatures) | **Varies, typically 5–10 years** |
| **Basel III / CRD IV** | Bank capital and risk records | **At least 5 years** |

> **Note:** Each EU member state transposes directives into national law, so exact periods vary. Germany, for instance, requires **10 years** for bookkeeping records (Handelsgesetzbuch §257).

## United Kingdom

| Regulation / Law | Data Type | Retention Period |
|---|---|---|
| **Companies Act 2006** | Accounting records | **3 years** (private co.) / **6 years** (public co.) |
| **Limitation Act 1980** | Contracts, deeds, and records relating to potential civil claims | **6 years** (simple contracts) / **12 years** (deeds) |
| **HMRC (Taxes Management Act 1970)** | Tax returns, VAT records, PAYE records | **5–6 years** (VAT: 6 years; Self-assessment: 5 years) |
| **Money Laundering Regulations 2017** | Customer due diligence records, transaction data | **5 years** after end of business relationship |
| **Financial Conduct Authority (FCA) SYSC Rules** | Client communications, compliance records | **At least 5 years** (MiFID-scope: up to 7 years) |
| **Employment Rights Act 1996 / Working Time Regulations** | Payroll records, working time records | **6 years** after employment ends |
| **Investigatory Powers Act 2016** (for telecoms/ISPs) | Communications metadata | **12 months** |
| **Health and Safety at Work Act 1974** | Accident reports, health surveillance records | **3 years** (accident books) / **40 years** (health surveillance) |

## United States

| Regulation / Law | Data Type | Retention Period |
|---|---|---|
| **Internal Revenue Code (IRS)** | Tax returns, supporting financial documents | **3–7 years** depending on type (7 years for bad debt/worthless securities) |
| **Sarbanes-Oxley Act (SOX)** | Audit workpapers, financial review documents, communications | **7 years** |
| **HIPAA (Health Insurance Portability and Accountability Act)** | Medical records, policies, procedures, documentation | **6 years** from date of creation or last effective date |
| **Fair Labor Standards Act (FLSA)** | Payroll records, wage computations | **3 years** (basic records) / **2 years** (supplementary records) |
| **Bank Secrecy Act (BSA) / FinCEN** | Suspicious Activity Reports (SARs), Currency Transaction Reports (CTRs), customer identification records | **5 years** |
| **SEC Rule 17a-4** | Broker-dealer records, communications, trade records | **3–6 years** (varies by record type; some indefinitely) |
| **ERISA (Employee Retirement Income Security Act)** | Pension/benefits plan records | **6 years** |
| **OSHA Regulations (29 CFR 1904)** | Injury/illness logs, exposure records | **5 years** (injury logs) / **30 years** (toxic exposure records) |
| **Dodd-Frank Act** | Swap/derivatives transaction records | **5 years** |
| **State Laws** (e.g., CCPA/CPRA in California) | Various — note that CCPA also has deletion rights but exempts records needed for legal compliance | Varies by state |

> **Note:** The US has no single federal privacy law equivalent to GDPR. Retention requirements are sector-specific, creating a patchwork of obligations.

## Australia

| Regulation / Law | Data Type | Retention Period |
|---|---|---|
| **Australian Taxation Office (ATO) – Income Tax Assessment Act** | Tax records, financial statements, expense records | **5 years** (from date of lodgement or transaction) |
| **Corporations Act 2001 (Cth)** | Company financial records | **7 years** after the transactions covered by the records are completed |
| **Fair Work Act 2009** | Employee time and wages records | **7 years** |
| **AML/CTF Act 2006 (AUSTRAC)** | Customer identification/due diligence records, transaction records | **7 years** |
| **Telecommunications (Interception and Access) Act 1979 – Data Retention Scheme** | Telecommunications metadata (ISPs/telcos) | **2 years** |
| **Superannuation Industry (Supervision) Act 1993** | Member records, fund administration records | **5–10 years** |
| **Work Health and Safety Act 2011** | Incident notification records, health monitoring records | **5 years** (incidents) / **30 years** (health monitoring) |

> **Note:** Australia's Privacy Act 1988 (APP 11.2) requires destruction or de-identification of personal information no longer needed — but this is explicitly subject to overriding retention obligations under other laws.

## Canada

| Regulation / Law | Data Type | Retention Period |
|---|---|---|
| **Canada Revenue Agency (Income Tax Act)** | Tax records, receipts, financial records | **6 years** from end of the last tax year they relate to |
| **Excise Tax Act (GST/HST)** | GST/HST records | **6 years** |
| **PIPEDA (Personal Information Protection and Electronic Documents Act)** | Personal information used to make a decision about an individual | **Sufficiently long** for the individual to exercise access rights (typically interpreted as **1 year minimum**) |
| **FINTRAC (Proceeds of Crime – Money Laundering and Terrorist Financing Act)** | Client identification records, transaction reports, SARs | **5 years** (large cash transaction records) up to **10–15 years** for certain reports |
| **Canada Labour Code / Provincial Employment Standards** | Payroll, employment records | **3–6 years** (varies by province; federally regulated: 3 years after work is performed) |
| **Canada Business Corporations Act** | Corporate accounting records | **6 years** after the financial year to which they relate |
| **Provincial Privacy Acts** (e.g., Alberta PIPA, Quebec Law 25) | Personal information | Minimum **1–2 years** depending on province (Quebec requires retention for use/access period) |
| **Provincial Health Information Acts** | Patient health records | **10 years** (varies by province; some up to 15+ years) |

*This summary is for informational purposes and does not constitute legal advice. Ask the user to confirm the actual policy to enforce.*
