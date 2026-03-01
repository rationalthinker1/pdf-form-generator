import { Pdf, InputField } from '../../index';

const navy = 'bg-[#1e3a5f] text-white font-bold uppercase'
const cell = 'flex-1 border-r border-gray-400 last:border-r-0'
const tableRow = 'flex flex-row border-b border-gray-400 last:border-b-0'
const outerBorder = 'border border-gray-400'

export default function CHPContractPage2() {
  return (
    <Pdf.Document>
      <Pdf.Page size="letter">

        {/* ── HOMEOWNER INFORMATION HEADER ─────────────────────────────── */}
        <div className={`flex flex-row justify-between items-center px-2 py-1 ${navy}`}>
          <span className="text-sm tracking-wide">Homeowner Information</span>
          <span className="text-xs font-semibold tracking-widest">Print Neatly in Capital Letters</span>
        </div>

        {/* ── HOMEOWNER INFO TABLE ──────────────────────────────────────── */}
        <div className={outerBorder}>

          {/* Row 1: First Name | Last Name | Date of Birth */}
          <div className={tableRow}>
            <div className={cell}>
              <InputField name="p2.first_name" label="First Name" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
            <div className={cell}>
              <InputField name="p2.last_name" label="Last Name" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
            <div className="border-r-0 border-gray-400 w-48">
              <InputField name="p2.date_of_birth" label="Date of Birth" type="date"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
          </div>

          {/* Row 2: Co-Customer First Name | Co-Customer Last Name | Date of Birth */}
          <div className={tableRow}>
            <div className={cell}>
              <InputField name="p2.cocustomer_first_name" label="Co-Customer First Name" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
            <div className={cell}>
              <InputField name="p2.cocustomer_last_name" label="Co-Customer Last Name" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
            <div className="w-48">
              <InputField name="p2.cocustomer_date_of_birth" label="Date of Birth" type="date"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
          </div>

          {/* Row 3: Installation Address | Unit # */}
          <div className={tableRow}>
            <div className={cell}>
              <InputField name="p2.address" label="Installation Address (Place of execution unless otherwise noted)" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
            <div className="w-36">
              <InputField name="p2.unit" label="Unit #" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
          </div>

          {/* Row 4: City | Province | Email Address */}
          <div className={tableRow}>
            <div className={cell}>
              <InputField name="p2.city" label="City" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
            <div className="w-24 border-r border-gray-400">
              <InputField name="p2.province" label="Province" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
            <div className="flex-[2]">
              <InputField name="p2.email" label="Email Address (Required for Rebate Confirmation)" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
          </div>

          {/* Row 5: Postal Code | Home Phone | Mobile or Office */}
          <div className={`${tableRow} border-b-0`}>
            <div className={cell}>
              <InputField name="p2.postal_code" label="Postal Code" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
            <div className={cell}>
              <InputField name="p2.home_phone" label="Home Phone" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
            <div className="">
              <InputField name="p2.mobile_or_office" label="Mobile or Office" type="text"
                labelClassName="text-[10px]" textClassName="bg-white h-8" />
            </div>
          </div>

        </div>

        {/* ── MAINTENANCE PLAN OPTIONS HEADER ──────────────────────────── */}
        <div className={`px-2 py-1 mt-0 ${navy}`}>
          <span className="text-sm tracking-wide">Maintenance Plan Options</span>
        </div>

        {/* ── PLAN TABLE ───────────────────────────────────────────────── */}
        <div className={`${outerBorder} border-t-0`}>

          {/* Column headers */}
          <div className={`${tableRow} bg-gray-100`}>
            <div className="flex-[3] border-r border-gray-400 px-2 py-1 text-xs font-bold text-gray-800">Description</div>
            <div className="w-28 border-r border-gray-400 px-2 py-1 text-xs font-bold text-gray-800 text-center">Payment</div>
            <div className="w-20 border-r border-gray-400 px-2 py-1 text-xs font-bold text-gray-800 text-center">HST</div>
            <div className="w-24 px-2 py-1 text-xs font-bold text-gray-800 text-center">Total</div>
          </div>

          {/* Premium Plan row */}
          <div className={tableRow}>
            <div className="flex-[3] border-r border-gray-400 px-2 py-1 flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-600 flex-shrink-0" />
              <span className="text-xs text-gray-800"><strong>Premium Plan</strong> (Heating &amp; Cooling)</span>
            </div>
            <div className="w-28 border-r border-gray-400 px-2 py-1 text-xs text-gray-800 text-center flex items-center justify-center">$29.98</div>
            <div className="w-20 border-r border-gray-400 px-2 py-1 text-xs text-gray-800 text-center flex items-center justify-center">$3.90</div>
            <div className="w-24 px-2 py-1 text-xs text-gray-800 text-center flex items-center justify-center">$33.88</div>
          </div>

          {/* Empty plan rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className={tableRow} style={{ height: 28 }}>
              <div className="flex-[3] border-r border-gray-400" />
              <div className="w-28 border-r border-gray-400" />
              <div className="w-20 border-r border-gray-400" />
              <div className="w-24" />
            </div>
          ))}

          {/* Footer: note + Start Date */}
          <div className={`${tableRow} border-b-0`}>
            <div className="flex-1 border-r border-gray-400 px-2 py-1 text-[10px] text-gray-800 flex items-center">
              *Please check all that apply. See details of each plan in HMP Terms and Conditions.
            </div>
            <div className="w-52 flex flex-row">
              <div className={`flex items-center justify-center px-3 text-xs font-bold ${navy}`} style={{ width: 80 }}>
                Start Date
              </div>
              <div className="flex-1">
                <InputField name="p2.start_date" label="" type="date"
                  labelClassName="hidden" textClassName="bg-white h-full" />
              </div>
            </div>
          </div>

        </div>

      </Pdf.Page>

      <Pdf.Script>{`
var prov = this.getField("p2.province");
if (prov) {
  prov.setAction("Keystroke", "event.change = event.change.toUpperCase(); if (event.value.length + event.change.length > 2) event.rc = false;");
}
      `}</Pdf.Script>
    </Pdf.Document>
  );
}
