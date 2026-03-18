-- ============================================================
-- Seed: New Income-tax Act 2025 — AY 2027-28 official data
-- Applied via: Supabase MCP execute_sql()
-- ============================================================

INSERT INTO public.reckoner_content (category, tax_year, sub_category, data, effective_from, notes) VALUES

('tax-slabs', '2027-28', 'new-regime', '[
  {"income_range":"Up to ₹3,00,000","rate":"Nil","notes":""},
  {"income_range":"₹3,00,001 – ₹7,00,000","rate":"5%","notes":"Rebate u/s 87A: nil tax up to ₹12L"},
  {"income_range":"₹7,00,001 – ₹10,00,000","rate":"10%","notes":""},
  {"income_range":"₹10,00,001 – ₹12,00,000","rate":"15%","notes":""},
  {"income_range":"₹12,00,001 – ₹15,00,000","rate":"20%","notes":""},
  {"income_range":"Above ₹15,00,000","rate":"30%","notes":"Surcharge above ₹50L"}
]'::jsonb, '2026-04-01', 'DEFAULT regime from FY 2026-27. Std Deduction ₹75,000 for salaried. No chapter VI-A deductions.'),

('tax-slabs', '2027-28', 'old-regime', '[
  {"income_range":"Up to ₹2,50,000","rate":"Nil","notes":""},
  {"income_range":"₹2,50,001 – ₹5,00,000","rate":"5%","notes":"Rebate u/s 87A: nil tax up to ₹5L"},
  {"income_range":"₹5,00,001 – ₹10,00,000","rate":"20%","notes":""},
  {"income_range":"Above ₹10,00,000","rate":"30%","notes":"Surcharge above ₹50L"}
]'::jsonb, '2026-04-01', 'Explicit opt-out required. All Chapter VI-A deductions and HRA/LTA exemptions allowed.'),

('tax-slabs', '2027-28', 'surcharge', '[
  {"income_range":"Up to ₹50,00,000","rate":"Nil","notes":""},
  {"income_range":"₹50,00,001 – ₹1 Cr","rate":"10%","notes":"On tax"},
  {"income_range":"₹1 Cr – ₹2 Cr","rate":"15%","notes":""},
  {"income_range":"₹2 Cr – ₹5 Cr","rate":"25%","notes":"New Regime cap"},
  {"income_range":"Above ₹5 Cr","rate":"37%","notes":"Old Regime only"}
]'::jsonb, '2026-04-01', '4% Health & Education Cess on (Tax + Surcharge) for all.'),

('deductions-limits', '2027-28', 'general', '[
  {"section":"Standard Deduction (Salaried)","limit":"₹75,000","regime":"New Regime"},
  {"section":"Standard Deduction (Pensioners)","limit":"₹25,000","regime":"New Regime"},
  {"section":"80C","limit":"₹1,50,000","regime":"Old Regime only"},
  {"section":"80CCD(1B) NPS Additional","limit":"₹50,000","regime":"Old Regime only"},
  {"section":"80CCD(2) NPS Employer","limit":"14% Basic+DA (Govt) / 10% (Pvt)","regime":"Both Regimes"},
  {"section":"80D Self/Family","limit":"₹25,000","regime":"Old Regime only"},
  {"section":"80D Senior Parents","limit":"₹50,000","regime":"Old Regime only"},
  {"section":"80TTA Bank Interest","limit":"₹10,000","regime":"Old Regime only"},
  {"section":"80TTB Senior Citizens Interest","limit":"₹50,000","regime":"Old Regime only"},
  {"section":"HRA Exemption","limit":"Min of 3 components","regime":"Old Regime only"},
  {"section":"LTA","limit":"Actual costs (2 journeys/4 yrs)","regime":"Old Regime only"}
]'::jsonb, '2026-04-01', 'New Regime: only 80CCD(2) and standard deduction available.'),

('deductions-limits', '2027-28', 'rebate-surcharge', '[
  {"item":"87A Rebate (New Regime)","amount":"₹60,000","condition":"Income ≤ ₹12,00,000 → tax = nil"},
  {"item":"87A Rebate (Old Regime)","amount":"₹12,500","condition":"Income ≤ ₹5,00,000"},
  {"item":"Health & Education Cess","amount":"4%","condition":"On Tax + Surcharge — all taxpayers"},
  {"item":"AMT","amount":"18.5%","condition":"On Adjusted Total Income (non-corporate)"}
]'::jsonb, '2026-04-01', 'Rebate reduces tax to nil; inapplicable above threshold.'),

('depreciation-rates', '2027-28', 'tangible-assets', '[
  {"block":"Block 1 – Residential Buildings","rate":"5%"},
  {"block":"Block 2 – Commercial Buildings, Furniture","rate":"10%"},
  {"block":"Block 3 – Plant & Machinery (General)","rate":"15%"},
  {"block":"Block 4 – Motor Vehicles (Non-personal)","rate":"15%"},
  {"block":"Block 5 – Ships","rate":"20%"},
  {"block":"Block 6 – Aircraft & Aero-engines","rate":"40%"},
  {"block":"Block 7 – Computers, Peripherals & Software","rate":"40%"},
  {"block":"Block 8 – Energy-saving / Renewables","rate":"40%"},
  {"block":"Block 9 – Intangible Assets","rate":"25%"}
]'::jsonb, '2026-04-01', 'Written Down Value (WDV) method. Additional 20% depreciation on new manufacturing P&M (Old Regime).'),

('tds-tcs-rates', '2027-28', 'tds', '[
  {"section":"192","nature":"Salaries","rate":"Slab rates","threshold":"Exemption limit"},
  {"section":"193","nature":"Interest on Securities","rate":"10%","threshold":"₹10,000"},
  {"section":"194","nature":"Dividends","rate":"10%","threshold":"₹5,000"},
  {"section":"194A","nature":"Bank Interest","rate":"10%","threshold":"₹40,000 / ₹50,000 (Sr)"},
  {"section":"194B","nature":"Lottery Winnings","rate":"30%","threshold":"₹10,000"},
  {"section":"194C","nature":"Contractor Payments","rate":"1%/2%","threshold":"₹30,000 / ₹1L agg"},
  {"section":"194H","nature":"Commission/Brokerage","rate":"5%","threshold":"₹20,000"},
  {"section":"194I","nature":"Rent (P&M)","rate":"2%","threshold":"₹2,40,000 p.a."},
  {"section":"194I","nature":"Rent (Land/Building)","rate":"10%","threshold":"₹2,40,000 p.a."},
  {"section":"194IA","nature":"Immovable Property Transfer","rate":"1%","threshold":"₹50,00,000"},
  {"section":"194J","nature":"Professional Fees","rate":"10%","threshold":"₹30,000"},
  {"section":"194J","nature":"Technical Services","rate":"2%","threshold":"₹30,000"},
  {"section":"194N","nature":"Cash Withdrawal","rate":"2%","threshold":"₹1 Cr"},
  {"section":"194Q","nature":"Purchase of Goods","rate":"0.1%","threshold":"₹50,00,000"}
]'::jsonb, '2026-04-01', 'Higher TDS at double rate if PAN not furnished.'),

('tds-tcs-rates', '2027-28', 'tcs', '[
  {"section":"206C(1)","nature":"Timber / Tendu Leaves","rate":"2.5%/5%","threshold":"—"},
  {"section":"206C(1F)","nature":"Sale of Motor Vehicle > ₹10L","rate":"1%","threshold":"₹10,00,000"},
  {"section":"206C(1G)","nature":"Foreign Remittance (LRS)","rate":"20%/5%","threshold":"₹7,00,000 per FY"},
  {"section":"206C(1G)","nature":"Overseas Tour Package","rate":"20%","threshold":"No threshold"},
  {"section":"206C(1H)","nature":"Sale of Goods > ₹50L","rate":"0.1%","threshold":"₹50,00,000"}
]'::jsonb, '2026-04-01', 'TCS credited against buyer''s final tax liability.'),

('cii-history', 'N/A', 'history', '[
  {"fy":"2001-02","cii":"100","notes":"Base year"},
  {"fy":"2002-03","cii":"105"},{"fy":"2003-04","cii":"109"},{"fy":"2004-05","cii":"113"},
  {"fy":"2005-06","cii":"117"},{"fy":"2006-07","cii":"122"},{"fy":"2007-08","cii":"129"},
  {"fy":"2008-09","cii":"137"},{"fy":"2009-10","cii":"148"},{"fy":"2010-11","cii":"167"},
  {"fy":"2011-12","cii":"184"},{"fy":"2012-13","cii":"200"},{"fy":"2013-14","cii":"220"},
  {"fy":"2014-15","cii":"240"},{"fy":"2015-16","cii":"254"},{"fy":"2016-17","cii":"264"},
  {"fy":"2017-18","cii":"272"},{"fy":"2018-19","cii":"280"},{"fy":"2019-20","cii":"289"},
  {"fy":"2020-21","cii":"301"},{"fy":"2021-22","cii":"317"},{"fy":"2022-23","cii":"331"},
  {"fy":"2023-24","cii":"348"},{"fy":"2024-25","cii":"363"},
  {"fy":"2025-26","cii":"385","notes":"Provisional"},
  {"fy":"2026-27","cii":"402","notes":"Estimated — pending CBDT notification"}
]'::jsonb, '2026-04-01', 'Base Year 2001-02 = 100. CBDT notifies CII annually. Used for LTCG indexed cost.'),

('new-act-changes', '2027-28', 'highlights', '[
  {"change":"Complete Renumbering","detail":"All sections renumbered for clarity under New Income-tax Act 2025.","impact":"High"},
  {"change":"New Regime is Default","detail":"Permanent default from FY 2026-27. Explicit opt-out needed for old regime.","impact":"High"},
  {"change":"Simplified Language","detail":"Act rewritten in plain English with tabular formats.","impact":"Medium"},
  {"change":"Capital Gains Rationalisation","detail":"STCG equity at 20%, LTCG exemption ₹1.25L. Indexation removed for most assets.","impact":"High"},
  {"change":"VDA Taxation Framework","detail":"Dedicated chapter for Crypto/NFT. 30% tax + 1% TDS (194S). No loss netting.","impact":"Medium"},
  {"change":"Assessment Timelines","detail":"Reduced notice periods and shortened reassessment windows.","impact":"Medium"},
  {"change":"TDS Rationalisation","detail":"Fewer TDS sections with simplified rates and merged provisions.","impact":"Medium"},
  {"change":"Faceless Scheme Codified","detail":"Faceless Assessment and Appeals now statutory under new Act.","impact":"Medium"},
  {"change":"Dispute Resolution","detail":"New Committee for small taxpayers (income ≤ ₹60L, disputed tax ≤ ₹10L).","impact":"Medium"},
  {"change":"E-filing Mandatory","detail":"Mandatory for all except Super Senior Citizens (80+ without tax at source).","impact":"Low"}
]'::jsonb, '2026-04-01', 'Effective 1 April 2026 (AY 2027-28). New Income-tax Act 2025.');
