import { Pdf, InputField } from '../../index';

const navy = 'bg-[#1e3a5f] text-white font-bold uppercase'
const cell = 'flex-1 border-r border-gray-400 last:border-r-0'
const tableRow = 'flex flex-row border-b border-gray-400 last:border-b-0'
const outerBorder = 'border border-gray-400'

export default function CHPContractPage2() {
  return (
    <Pdf.Document>

      {/* ── PAGE 1: CONSUMER PROTECTION ACT ─────────────────────────── */}
      <Pdf.Page size="letter">
        <div className="px-12 py-2 text-[12.5px] text-gray-900 leading-snug font-sans">

          <p className="font-bold text-sm mb-3">Your Rights under the Consumer Protection Act, 2002</p>

          <p className="mb-3 text-justify">
            You may cancel this Agreement at any time during the period that ends ten (10) days after the day
            you receive a written copy of the Agreement. You do not need to give the supplier a reason for
            cancelling during this 10-day period.
          </p>

          <p className="mb-3 text-justify font-bold">
            If the supplier does not make delivery within 30 days after the delivery date specified in this
            agreement or if the supplier does not begin performance of his, her or its obligations within 30 days
            after the commencement date specified in this Agreement, you may cancel this Agreement at any
            time before delivery or commencement of performance. You lose the right to cancel if, after the
            30-day period has expired, you agree to accept delivery or authorize commencement of
            performance. If the delivery date or commencement date is not specified in this Agreement and the
            supplier does not deliver or commence performance within 30 days after the date this Agreement is
            entered into, you may cancel this Agreement at any time before delivery or commencement of
            performance. You lose the right to cancel if, after the 30-day period has expired, you agree to accept
            delivery or authorize commencement of performance. In addition, there are other grounds that
            allow you to cancel this Agreement. You may also have other rights, duties and remedies at law.
          </p>

          <p className="mb-3 text-justify">
            For more information, you may contact the Ministry of Government and Consumer Services. To
            cancel this Agreement, you must give notice of cancellation to the supplier, at the address set out
            in the Agreement, by any means that allows you to prove the date on which you gave notice. If
            no address is set out in the Agreement, use any address of the supplier that is on record with the
            Government of Ontario or the Government of Canada or is known by you.
          </p>

          <p className="mb-3 text-justify">
            If you cancel this Agreement, the supplier has fifteen (15) days to refund any payment you have
            made and return to you all goods delivered under a trade-in arrangement (or refund an amount
            equal to the trade-in allowance). However, if you cancel this Agreement after having solicited the
            goods or services from the supplier and having requested that delivery be made or performance
            be commenced within ten (10) days after the date this Agreement is entered into, the supplier is
            entitled to reasonable compensation for the goods and services that you received before the
            earlier of the 11th day after the date this Agreement was entered into and the date on which you
            gave notice of cancellation to the supplier, except goods that can be repossessed by or returned
            to the supplier.
          </p>

          <p className="mb-3 text-justify">
            If the supplier requests in writing repossession of any goods that came into your possession
            under the Agreement, you must return the goods to the supplier's address, or allow one of the
            following persons to repossess the goods at your address:
          </p>

          <p className="mb-1">a) The supplier.</p>
          <p className="mb-3">b) A person designated in writing by the supplier.</p>

          <p className="mb-3 text-justify">
            If you cancel this Agreement, you must take reasonable care of any goods that came into your
            possession under the Agreement until one of the following happens:
          </p>
          <p className="mb-1">a) The supplier repossesses the goods.</p>
          <p className="mb-1">b) The supplier has been given a reasonable opportunity to repossess the goods and twenty-one
            (21) days have passed since the Agreement was cancelled.</p>
          <p className="mb-1">c) You return the goods.</p>
          <p className="mb-3">d) The supplier directs you in writing to destroy the goods and you do so in accordance with the
            supplier's instructions.</p>

          <p className="mb-3">For more information contact:</p>

          <p className="mb-0">Canada Home Protect</p>
          <p className="mb-0">Toll Free: 1-833-347-0209</p>
          <p className="mb-0">4789 Yonge Street, Suite 805</p>
          <p className="mb-0">Toronto ON M2NOG3</p>
          <p className="mb-0">Email: admin@canadahomeprotect.ca</p>

          {/* Footer */}
          <div className="absolute bottom-6 left-12 right-12 flex flex-row justify-between border-t border-gray-300 pt-1 mt-4">
            <span className="text-[10px] text-gray-500">Canada Home Protect</span>
            <span className="text-[10px] text-gray-500">2/5</span>
            <span className="text-[10px] text-gray-500">PG2/5</span>
          </div>

        </div>
      </Pdf.Page>

      {/* ── PAGE 2: SERVICE AGREEMENT FORM ───────────────────────────── */}
      <Pdf.Page size="letter">

        {/* ── HEADER: LOGO + SERVICE AGREEMENT ────────────────────────── */}
        <div className="flex flex-row items-center border-b-2 border-gray-300 pb-3 mb-0">

          {/* Logo mark */}
          <div className="flex flex-row items-center gap-3 pr-6 border-r border-gray-300">
            {/* Shield icon approximation */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg viewBox="0 0 64 72" className="w-full h-full" fill="currentColor">
                {/* Outer shield */}
                <path d="M32 2 L60 14 L60 38 C60 54 48 66 32 70 C16 66 4 54 4 38 L4 14 Z" fill="#1a1a1a"/>
                {/* Swoosh ring */}
                <ellipse cx="32" cy="36" rx="20" ry="8" fill="none" stroke="white" strokeWidth="2.5" transform="rotate(-20 32 36)"/>
                {/* Maple leaf simplified */}
                <path d="M32 18 L34 24 L40 22 L36 28 L42 30 L32 34 L22 30 L28 28 L24 22 L30 24 Z" fill="white"/>
                {/* House roof */}
                <path d="M24 42 L32 35 L40 42 Z" fill="white"/>
                <rect x="26" y="42" width="12" height="9" fill="white"/>
                <rect x="29" y="46" width="6" height="5" fill="#1a1a1a"/>
              </svg>
            </div>
            {/* Brand name */}
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-black text-gray-900 tracking-tight uppercase">Canada</span>
              <span className="text-xl font-black text-gray-900 tracking-tight uppercase">Home</span>
              <span className="text-xl font-black text-gray-900 tracking-tight uppercase">Protect</span>
            </div>
          </div>

          {/* Right side: title + contact */}
          <div className="flex flex-col flex-1 pl-6 gap-1">
            <span className="text-3xl font-black text-[#1e3a5f] uppercase tracking-wide leading-none">Service Agreement</span>
            <div className="flex flex-row gap-8 mt-1">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                  <span>📞</span><span>1-833-347-0209</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                  <span>🌐</span><span>www.canadahomeprotect.ca</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                  <span>✉</span><span>admin@canadahomeprotect.ca</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                  <span>📍</span><span>805-4789 Yonge Street, Toronto ON M2NOG3</span>
                </div>
              </div>
            </div>
          </div>

        </div>

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
            <div className="flex-2">
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
