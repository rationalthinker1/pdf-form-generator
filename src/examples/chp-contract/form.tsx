import { Pdf, InputField } from '../../index';

const navy = 'bg-[#1e3a5f] text-white font-bold uppercase'
const cell = 'flex-1 border-r border-gray-400 last:border-r-0'
const tableRow = 'flex flex-row border-b border-gray-400 last:border-b-0'
const outerBorder = 'border border-gray-400'

export default function CHPContractPage2() {
  return (
    <Pdf.Document>

      {/* ── PAGE 0: IMPORTANT — LEGAL RIGHTS COVER PAGE ──────────────── */}
      <Pdf.Page size="letter">
        <div className="text-[11px] text-gray-900 leading-snug font-sans border border-gray-400">

          {/* Header */}
          <div className="">
            <div className="bg-[#1e3a5f] text-white px-3 py-1.5 border-b border-[#2d5a8e]">
              <p className="font-bold text-center text-[13px] leading-tight">IMPORTANT: What You Need to Know About Your Legal Rights</p>
            </div>
            <div className="px-3 py-1.5 text-[14px] text-center font-semibold">
              <p>Please read, and if you sign a contract, keep all paperwork for your records.</p>
              <p>Companies are required by law to provide this cover page with contracts for the</p>
              <p>products and services listed below.</p>
            </div>
          </div>

          {/* Government disclaimer */}
          <div className="px-3 py-2 border-b border-gray-400">
            <p className="font-bold text-center text-[16px]">The Government of Ontario is not affiliated with and does not endorse any company</p>
          </div>

          {/* Products list */}
          <div className="px-3 py-2 border-b border-gray-400">
            <p className="mb-2 font-semibold">
              Under Ontario's Consumer Protection Act, 2002 unsolicited door-to-door marketing and
              contracting for the following products and services are illegal, subject to certain exceptions.
            </p>
            <div className="flex flex-row text-[12px] gap-16 pl-4">
              <ul className="space-y-0.5">
                <li>• Furnaces</li>
                <li>• Air conditioners</li>
                <li>• Air cleaners</li>
                <li>• Air purifiers</li>
                <li>• Water heaters</li>
                <li>• Water treatment devices</li>
              </ul>
              <ul className="space-y-0.5">
                <li>• Water purifiers</li>
                <li>• Water filters</li>
                <li>• Water softeners</li>
                <li>• Duct cleaning services</li>
                <li>• Bundles of these goods and</li>
                <li className="pl-3">services (such as HVAC)</li>
              </ul>
            </div>
          </div>

          {/* Checkbox options */}
          <div className="px-3 py-3 border-b border-gray-400">
            <p className="font-bold mb-3">
              Suppliers cannot market or contract for these products or services at your home unless one
              of the situations applies (please check the appropriate box):
            </p>
            <div className="flex flex-row items-start gap-3 mb-3 pl-2">
              <Pdf.CheckboxField name="p0.invited_supplier" className="mt-0.5 shrink-0 w-5 h-5" />
              <p>
                You contacted the supplier to invite them to your home to buy or lease at least one of
                the products above (not for repair, an energy assessment, maintenance, or any other reason).
              </p>
            </div>
            <div className="flex flex-row items-start gap-3 pl-2">
              <Pdf.CheckboxField name="p0.current_supplier" className="mt-0.5 shrink-0 w-5 h-5" />
              <p>
                You agreed to allow your current supplier to come to your home and agreed they
                may offer you a contract for one of the products or services listed above.
              </p>
            </div>
          </div>

          {/* Cancellation rights */}
          <div className="px-3 py-2 border-b border-gray-400">
            <p className="font-bold mb-2">
              You may cancel this contract within 10 days after receiving a written copy of it. You do not
              need a reason to cancel, but cancel it in writing so you have proof.
            </p>
            {/* Company name: label + underline with text right-aligned */}
            <div className="flex flex-row items-end gap-1 mb-1">
              <span className="whitespace-nowrap shrink-0">Name of company offering this contract:</span>
              <div className="relative flex-1 border-b border-gray-800">
                <Pdf.TextField name="p0.company_name" type="text" defaultValue="Canada Home Protect"
                  className="absolute inset-0 bg-transparent border-none text-right text-[11px] h-5 px-0" />
              </div>
            </div>
            {/* Purpose: label on its own line, then underline with centered text */}
            <p className="mb-0.5">For what purpose did you ask this business to come to your home?</p>
            <div className="relative border-b border-gray-800 mb-0">
              <Pdf.TextField name="p0.purpose" type="text" defaultValue="home maintenance &amp; service program"
                className="w-full bg-transparent border-none text-center text-[11px] h-5 px-0" />
            </div>
          </div>

          {/* Void contract notice */}
          <div className="px-3 py-2 border-b border-gray-400">
            <p className="mb-2">
              If you did not invite this salesperson to your home for the purpose of buying or leasing the
              goods or services listed above, this contract may be void and you may be able to keep the
              goods or services without any obligations.
            </p>
            <p className="mb-2">
              <span className="font-bold">IMPORTANT:</span> Suppliers may register a security interest (commonly known as a lien) on the
              goods that you are acquiring, and they may also register a notice of security interest on the
              title to your home.
            </p>
            <p className="mb-2 font-bold">
              Before you sign, please review your contract. Ask your supplier if the company will register a
              security interest. This could have legal or financial implications should you decide to cancel
              the contract early, secure financing, or sell your home. In these circumstances, seeking the
              advice of a lawyer is recommended.
            </p>
            <div className="flex flex-row items-end gap-1 mb-2">
              <span className="whitespace-nowrap shrink-0">Your name (please print)</span>
              <div className="flex-1 border-b border-gray-800 h-4" />
            </div>
            <div className="flex flex-row items-end gap-6">
              <div className="flex flex-row items-end gap-1 flex-1">
                <span className="whitespace-nowrap shrink-0">Your signature</span>
                <div className="flex-1 border-b border-gray-800 h-4" />
              </div>
              <div className="flex flex-row items-end gap-1">
                <span className="whitespace-nowrap shrink-0">Date</span>
                <div className="w-28 border-b border-gray-800 h-4" />
              </div>
            </div>
          </div>

          {/* Footer: CPO logo area + info box */}
          <div className="flex flex-row">
            <div className="flex flex-col justify-between px-3 py-2 w-44 border-r border-gray-400">
              <div className="flex flex-row items-center gap-2">
                {/* CPO logo: red ring with inner filled circle */}
                <svg viewBox="0 0 40 40" className="w-10 h-10 shrink-0">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="#c8102e" strokeWidth="4" />
                  <circle cx="20" cy="20" r="10" fill="#c8102e" />
                </svg>
                <div className="text-[9px] font-black uppercase leading-tight text-[#1e3a5f]">
                  <div>Consumer</div>
                  <div>Protection</div>
                  <div>Ontario</div>
                </div>
              </div>
              <p className="text-[9px] text-gray-500 mt-2">January 16, 2018</p>
            </div>
            <div className="flex-1 bg-[#1e3a5f] text-white px-3 py-2 flex flex-col justify-center">
              <p className="text-[10px] font-bold mb-1 text-center">
                If you have questions about your rights as a consumer
                or what should be included in your contract, call
                Consumer Protection Ontario before signing:
              </p>
              <p className="text-[9px] text-center">
                416-326-8800 or 1-800-889-9768/TTY: 416-229-6086 or 1-877-666-6545
              </p>
              <p className="text-[9px] text-center">Ontario.ca/consumerprotection</p>
            </div>
          </div>

          {/* Page footer */}
          <div className="flex flex-row justify-between px-3 py-1 border-t border-gray-300">
            <span className="text-[9px] text-gray-500">Canada Home Protect</span>
            <span className="text-[9px] text-gray-500">1/5</span>
            <span className="text-[9px] text-gray-500">PG1/5</span>
          </div>

        </div>
      </Pdf.Page>

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
              <div className="w-4 h-4 border border-gray-600 shrink-0" />
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
