import { Pdf, InputField } from '../../index';

const navy = 'bg-[#1e3a5f] text-white font-bold uppercase'
const cell = 'flex-1 border-r border-gray-400 last:border-r-0'
const tableRow = 'flex flex-row border-b border-gray-400 last:border-b-0'
const outerBorder = 'border border-gray-400'

export default function CHPContractPage2() {
  return (
    <Pdf.Document>

      {/* ── PAGE 0: IMPORTANT — LEGAL RIGHTS COVER PAGE ──────────────── */}
      <Pdf.Page size="letter" footer={
        <Pdf.Footer>
          <span className="text-[9px] text-gray-500">Canada Home Protect</span>
          <span className="text-[9px] text-gray-500">1/5</span>
          <span className="text-[9px] text-gray-500">PG1/5</span>
        </Pdf.Footer>
      }>
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
                <Pdf.TextField name="p0.company_name" type="text"
                  className="absolute inset-0 bg-transparent border-none text-right text-[11px] h-5 px-0" />
              </div>
            </div>
            {/* Purpose: label on its own line, then underline with centered text */}
            <p className="mb-0.5">For what purpose did you ask this business to come to your home?</p>
            <div className="relative border-b border-gray-800 mb-0">
              <Pdf.TextField name="p0.purpose" type="text"
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

        </div>

      </Pdf.Page>

      {/* ── PAGE 1: CONSUMER PROTECTION ACT ─────────────────────────── */}
      <Pdf.Page size="letter" footer={
        <Pdf.Footer>
          <span className="text-[9px] text-gray-500">Canada Home Protect</span>
          <span className="text-[9px] text-gray-500">2/5</span>
          <span className="text-[9px] text-gray-500">PG2/5</span>
        </Pdf.Footer>
      }>
        <div className="px-3 pt-3 text-[11px] text-gray-900 font-sans">

          {/* Title — T1_0 bold 12pt */}
          <p className="font-bold text-[12px] mb-4">Your Rights under the Consumer Protection Act, 2002</p>

          {/* Paragraph 1 — T1_0 bold 10pt, justified */}
          <p className="font-bold text-[10px] mb-3 text-justify leading-normal">
            You may cancel this Agreement at any time during the period that ends ten (10) days after the day
            you receive a written copy of the Agreement. You do not need to give the supplier a reason for
            cancelling during this 10-day period.
          </p>

          {/* Paragraph 2 — T1_0 bold 10pt, justified */}
          <p className="font-bold text-[10px] mb-3 text-justify leading-normal">
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

          {/* Remaining paragraphs — T1_1 regular 11pt, justified */}
          <p className="mb-3 text-justify leading-normal">
            For more information, you may contact the Ministry of Government and Consumer Services. To
            cancel this Agreement, you must give notice of cancellation to the supplier, at the address set out
            in the Agreement, by any means that allows you to prove the date on which you gave notice. If
            no address is set out in the Agreement, use any address of the supplier that is on record with the
            Government of Ontario or the Government of Canada or is known by you.
          </p>

          <p className="mb-3 text-justify leading-normal">
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

          <p className="mb-3 text-justify leading-normal">
            If the supplier requests in writing repossession of any goods that came into your possession
            under the Agreement, you must return the goods to the supplier&#8217;s address, or allow one of the
            following persons to repossess the goods at your address:
          </p>

          {/* List with hanging indent — matches PDF kerning style */}
          <div className="mb-3 pl-1">
            <div className="flex mb-1">
              <span className="w-6 shrink-0">a)</span>
              <span>The supplier.</span>
            </div>
            <div className="flex">
              <span className="w-6 shrink-0">b)</span>
              <span>A person designated in writing by the supplier.</span>
            </div>
          </div>

          <p className="mb-3 text-justify leading-normal">
            If you cancel this Agreement, you must take reasonable care of any goods that came into your
            possession under the Agreement until one of the following happens:
          </p>

          <div className="mb-3 pl-1">
            <div className="flex mb-1">
              <span className="w-6 shrink-0">a)</span>
              <span>The supplier repossesses the goods.</span>
            </div>
            <div className="flex mb-1">
              <span className="w-6 shrink-0">b)</span>
              <span>The supplier has been given a reasonable opportunity to repossess the goods and twenty-one
                (21) days have passed since the Agreement was cancelled.</span>
            </div>
            <div className="flex mb-1">
              <span className="w-6 shrink-0">c)</span>
              <span>You return the goods.</span>
            </div>
            <div className="flex">
              <span className="w-6 shrink-0">d)</span>
              <span>The supplier directs you in writing to destroy the goods and you do so in accordance with the
                supplier&#8217;s instructions.</span>
            </div>
          </div>

          {/* Contact block — near bottom of page */}
          <p className="mb-1 leading-normal">For more information contact:</p>
          <p className="mb-0 leading-tight">Canada Home Protect</p>
          <p className="mb-0 leading-tight">Toll Free: 1-833-347-0209</p>
          <p className="mb-0 leading-tight">4789 Yonge Street, Suite 805</p>
          <p className="mb-0 leading-tight">Toronto ON M2NOG3</p>
          <p className="mb-0 leading-tight">Email: admin@canadahomeprotect.ca</p>

        </div>
      </Pdf.Page>

      {/* ── PAGE 2: SERVICE AGREEMENT FORM ───────────────────────────── */}
      <Pdf.Page size="letter" footer={
        <Pdf.Footer>
          <span className="text-[8px] text-gray-500">Canada Home Protect</span>
          <span className="text-[8px] text-gray-500">3/5</span>
          <span className="text-[8px] text-gray-500">PG3/5</span>
        </Pdf.Footer>
      }>

        {/* ── HEADER: LOGO + SERVICE AGREEMENT ────────────────────────── */}
        <div className="flex flex-row items-center border-b-2 border-gray-300 pb-2 mb-0">

          {/* Logo mark */}
          <div className="flex flex-row items-center gap-3 pr-6 border-r border-gray-300">
            {/* Shield icon approximation */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg viewBox="0 0 64 72" className="w-full h-full" fill="currentColor">
                {/* Outer shield */}
                <path d="M32 2 L60 14 L60 38 C60 54 48 66 32 70 C16 66 4 54 4 38 L4 14 Z" fill="#1a1a1a" />
                {/* Swoosh ring */}
                <ellipse cx="32" cy="36" rx="20" ry="8" fill="none" stroke="white" strokeWidth="2.5" transform="rotate(-20 32 36)" />
                {/* Maple leaf simplified */}
                <path d="M32 18 L34 24 L40 22 L36 28 L42 30 L32 34 L22 30 L28 28 L24 22 L30 24 Z" fill="white" />
                {/* House roof */}
                <path d="M24 42 L32 35 L40 42 Z" fill="white" />
                <rect x="26" y="42" width="12" height="9" fill="white" />
                <rect x="29" y="46" width="6" height="5" fill="#1a1a1a" />
              </svg>
            </div>
            {/* Brand name */}
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-black text-gray-900 tracking-tight uppercase">Canada</span>
              <span className="text-lg font-black text-gray-900 tracking-tight uppercase">Home</span>
              <span className="text-lg font-black text-gray-900 tracking-tight uppercase">Protect</span>
            </div>
          </div>

          {/* Right side: title + contact */}
          <div className="flex flex-col flex-1 pl-6 gap-0.5">
            <span className="text-2xl font-black text-[#1e3a5f] uppercase tracking-wide leading-none">Service Agreement</span>
            <div className="flex flex-row gap-8 mt-0.5">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
                  <span>📞</span><span>1-833-347-0209</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
                  <span>🌐</span><span>www.canadahomeprotect.ca</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
                  <span>✉</span><span>admin@canadahomeprotect.ca</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
                  <span>📍</span><span>805-4789 Yonge Street, Toronto ON M2NOG3</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── HOMEOWNER INFORMATION HEADER ─────────────────────────────── */}
        <div className={`flex flex-row justify-between items-center px-2 py-0.5 ${navy}`}>
          <span className="text-xs tracking-wide">Homeowner Information</span>
          <span className="text-[10px] font-semibold tracking-widest">Print Neatly in Capital Letters</span>
        </div>

        {/* ── HOMEOWNER INFO TABLE ──────────────────────────────────────── */}
        <div className={outerBorder}>

          {/* Row 1: First Name | Last Name | Date of Birth */}
          <div className={tableRow}>
            <div className={cell}>
              <InputField name="p2.first_name" label="First Name" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
            <div className={cell}>
              <InputField name="p2.last_name" label="Last Name" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
            <div className="border-r-0 border-gray-400 w-44">
              <InputField name="p2.date_of_birth" label="Date of Birth" type="date"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
          </div>

          {/* Row 2: Co-Customer First Name | Co-Customer Last Name | Date of Birth */}
          <div className={tableRow}>
            <div className={cell}>
              <InputField name="p2.cocustomer_first_name" label="Co-Customer First Name" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
            <div className={cell}>
              <InputField name="p2.cocustomer_last_name" label="Co-Customer Last Name" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
            <div className="w-44">
              <InputField name="p2.cocustomer_date_of_birth" label="Date of Birth" type="date"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
          </div>

          {/* Row 3: Installation Address | Unit # */}
          <div className={tableRow}>
            <div className={cell}>
              <InputField name="p2.address" label="Installation Address (Place of execution unless otherwise noted)" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
            <div className="w-36">
              <InputField name="p2.unit" label="Unit #" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
          </div>

          {/* Row 4: City | Province | Email Address */}
          <div className={tableRow}>
            <div className={cell}>
              <InputField name="p2.city" label="City" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
            <div className="w-24 border-r border-gray-400">
              <InputField name="p2.province" label="Province" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
            <div className="flex-2">
              <InputField name="p2.email" label="Email Address (Required for Rebate Confirmation)" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
          </div>

          {/* Row 5: Postal Code | Home Phone | Mobile or Office */}
          <div className={`${tableRow} border-b-0`}>
            <div className={cell}>
              <InputField name="p2.postal_code" label="Postal Code" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
            <div className={cell}>
              <InputField name="p2.home_phone" label="Home Phone" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
            <div className="">
              <InputField name="p2.mobile_or_office" label="Mobile or Office" type="text"
                labelClassName="text-[9px]" textClassName="bg-white h-6" />
            </div>
          </div>

        </div>

        {/* ── MAINTENANCE PLAN OPTIONS HEADER ──────────────────────────── */}
        <div className={`px-2 py-0.5 mt-0 ${navy}`}>
          <span className="text-xs tracking-wide">Maintenance Plan Options</span>
        </div>

        {/* ── PLAN TABLE ───────────────────────────────────────────────── */}
        <div className={`${outerBorder} border-t-0`}>

          {/* Column headers */}
          <div className={`${tableRow} bg-gray-100`}>
            <div className="flex-[3] border-r border-gray-400 px-2 py-0.5 text-[10px] font-bold text-gray-800">Description</div>
            <div className="w-28 border-r border-gray-400 px-2 py-0.5 text-[10px] font-bold text-gray-800 text-center">Payment</div>
            <div className="w-20 border-r border-gray-400 px-2 py-0.5 text-[10px] font-bold text-gray-800 text-center">HST</div>
            <div className="w-24 px-2 py-0.5 text-[10px] font-bold text-gray-800 text-center">Total</div>
          </div>

          {/* Premium Plan row */}
          <div className={tableRow}>
            <div className="flex-[3] border-r border-gray-400 px-2 py-0.5 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border border-gray-600 shrink-0" />
              <span className="text-[10px] text-gray-800"><strong>Premium Plan</strong> (Heating &amp; Cooling)</span>
            </div>
            <div className="w-28 border-r border-gray-400 px-2 py-0.5 text-[10px] text-gray-800 text-center flex items-center justify-center">$29.98</div>
            <div className="w-20 border-r border-gray-400 px-2 py-0.5 text-[10px] text-gray-800 text-center flex items-center justify-center">$3.90</div>
            <div className="w-24 px-2 py-0.5 text-[10px] text-gray-800 text-center flex items-center justify-center">$33.88</div>
          </div>

          {/* Empty plan rows */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className={tableRow} style={{ height: 22 }}>
              <div className="flex-[3] border-r border-gray-400" />
              <div className="w-28 border-r border-gray-400" />
              <div className="w-20 border-r border-gray-400" />
              <div className="w-24" />
            </div>
          ))}

          {/* Footer: note + Start Date */}
          <div className={`${tableRow} border-b-0`}>
            <div className="flex-1 border-r border-gray-400 px-2 py-0.5 text-[9px] text-gray-800 flex items-center">
              *Please check all that apply. See details of each plan in HMP Terms and Conditions.
            </div>
            <div className="w-52 flex flex-row h-6">
              <div className={`flex items-center justify-center px-3 text-[8px] font-bold ${navy}`} style={{ width: 80 }}>
                Start Date
              </div>
              <div className="flex-1">
                <InputField name="p2.start_date" label="" type="date"
                  labelClassName="hidden" textClassName="bg-white h-full" />
              </div>
            </div>
          </div>

        </div>

        {/* ── CUSTOMER PAYMENT INFORMATION ─────────────────────────────── */}
        <div className={`px-2 py-0.5 mt-0 ${navy}`}>
          <span className="text-xs tracking-wide">Customer Payment Information</span>
        </div>
        <div className={`${outerBorder} border-t-0 px-2 py-1`}>
          <div className="flex flex-row items-center gap-4 text-[10px] text-gray-800">
            <Pdf.CheckboxField name="p2.pad_enabled" className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold">Pre-Authorized Debit</span>
            <span className="font-semibold">Please Select PAD Date:</span>
            <div className="flex items-center gap-1.5">
              <Pdf.CheckboxField name="p2.pad_date_1st" className="w-3.5 h-3.5 shrink-0" />
              <span>1<sup>st</sup> day of the month</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Pdf.CheckboxField name="p2.pad_date_15th" className="w-3.5 h-3.5 shrink-0" />
              <span>15<sup>th</sup> day of the month</span>
            </div>
          </div>
          <p className="text-[9px] text-gray-700 mt-1 leading-snug">
            You hereby acknowledge that all payments to be made by you under this Agreement will be made by way of Pre-Authorized Debit (PAD), withdrawn
            monthly on the PAD date selected by you above. A Void Cheque or PAD Form must be attached to this Agreement.
          </p>
        </div>

        {/* ── MAINTENANCE PLANS TEXT ────────────────────────────────────── */}
        <div className="mt-2 text-[8.5px] text-gray-900 leading-snug">
          <p className="font-bold mb-0.5">MAINTENANCE PLANS</p>
          <p className="mb-0.5">By enrolling in a maintenance plan as described above, all repairs to your furnace and/or air conditioning unit or plumbing system will be completed at no additional cost for the term of the agreement*</p>
          <ul className="list-disc pl-4 mb-0.5 space-y-0">
            <li>All applicable parts &amp; labour repairs at no additional cost*</li>
            <li>24/7 emergency service hotline 1-833-347-0209</li>
            <li>Experienced, licensed and bonded technicians handle repairs</li>
            <li>Priority service on all calls</li>
            <li>No upfront fees for new/high efficiency replacement equipment*</li>
          </ul>
          <p className="mb-0.5">*Refer to HMP Terms and Conditions (attached) for details</p>
          <p className="mb-0.5">By selecting one of the following price maintenance programs from above, the customer, agrees to the Canada Home Protect™ Home Maintenance Plan (HMP) Terms and Conditions (attached).</p>
          <p className="mb-0.5">This Agreement will take effect 30 days after the date hereof. This Agreement is with Canada Home Protect™ and not my local utility provider. Unless agreed to in writing by Canada Home Protect™, no amendments, whether written or verbal, to this Agreement Form or Terms and Conditions will be accepted. By signing this Agreement, you agree that you have read, understand and agree to the Terms and Conditions on the reverse side and acknowledge receipt of a copy of this Agreement.</p>
          <p className="mb-1">Your Rights under the Consumer Protection Act, 2002, are outlined in Section 23 of the HMP Terms and Conditions of this Agreement, (attached).</p>
          <p className="font-bold text-center text-[10px] mb-2">YOUR CANCELLATION RIGHTS ARE LOCATED ON PAGE 4 OF 5</p>
        </div>

        {/* ── SIGNATURE BLOCK ───────────────────────────────────────────── */}
        <div className="text-[8.5px] text-gray-800">
          <div className="flex flex-row gap-4">

            {/* Left: Owner */}
            <div className="flex-1 flex flex-col gap-0.5">
              {/* Checkboxes centered above sig line */}
              <div className="flex flex-row justify-center gap-6">
                <div className="flex items-center gap-1"><Pdf.CheckboxField name="p2.sig_homeowner" className="w-3 h-3" /><span>Homeowner</span></div>
                <div className="flex items-center gap-1"><Pdf.CheckboxField name="p2.sig_spouse" className="w-3 h-3" /><span>Spouse</span></div>
              </div>
              {/* Sig line */}
              <div className="border-b border-gray-800 w-full" style={{ height: 14 }} />
              <span>Signature</span>
              {/* Print name + date on same line */}
              <div className="flex flex-row items-end gap-1 mt-1">
                <div className="flex-1 border-b border-gray-800" />
                <span>/</span>
                <div className="w-10 border-b border-gray-800" />
                <span>/</span>
                <div className="w-10 border-b border-gray-800" />
              </div>
              <div className="flex flex-row text-[7.5px] text-gray-500">
                <div className="flex-1">Print Legal Name</div>
                <div className="flex flex-row gap-1 mr-0.5">
                  <span className="w-10 text-center">Month</span>
                  <span className="w-10 text-center">Day</span>
                  <span className="w-10 text-center">Year</span>
                </div>
              </div>
              {/* Place of Execution */}
              <div className="flex flex-row items-end gap-1 mt-1">
                <span className="shrink-0">Place of Execution:</span>
                <div className="flex-1 border-b border-gray-800" />
              </div>
            </div>

            {/* Right: Co-Applicant */}
            <div className="flex-1 flex flex-col gap-0.5">
              <div className="flex flex-row justify-end gap-6">
                <div className="flex items-center gap-1"><Pdf.CheckboxField name="p2.cosig_homeowner" className="w-3 h-3" /><span>Homeowner</span></div>
                <div className="flex items-center gap-1"><Pdf.CheckboxField name="p2.cosig_spouse" className="w-3 h-3" /><span>Spouse</span></div>
              </div>
              <div className="border-b border-gray-800 w-full" style={{ height: 14 }} />
              <span>Co Applicant Signature</span>
              <div className="flex flex-row items-end gap-1 mt-1">
                <div className="flex-1 border-b border-gray-800" />
                <span>/</span>
                <div className="w-10 border-b border-gray-800" />
                <span>/</span>
                <div className="w-10 border-b border-gray-800" />
              </div>
              <div className="flex flex-row text-[7.5px] text-gray-500">
                <div className="flex-1">Co Applicant Print Legal Name</div>
                <div className="flex flex-row gap-1 mr-0.5">
                  <span className="w-10 text-center">Month</span>
                  <span className="w-10 text-center">Day</span>
                  <span className="w-10 text-center">Year</span>
                </div>
              </div>
              <div className="flex flex-row items-end gap-1 mt-1">
                <span className="shrink-0">Place of Execution:</span>
                <div className="flex-1 border-b border-gray-800" />
              </div>
            </div>

          </div>

          {/* Dealer section */}
          <div className={`${outerBorder} flex flex-row text-[8px] mt-1`}>
            <div className="flex-1 border-r border-gray-400 px-1 py-0.5">
              <div className="text-gray-500">Dealer Representative Signature</div>
              <div className="h-4" />
              <div className="text-gray-500 text-[7px]">(solicited, negotiated, and entered Agreement)</div>
            </div>
            <div className="flex-1 border-r border-gray-400 px-1 py-0.5">
              <div className="text-gray-500">Dealer Representative Name</div>
              <div className="h-4" />
            </div>
            <div className="flex-1 px-1 py-0.5">
              <div className="text-gray-500">Dealer Name &amp; Phone Number</div>
              <div className="h-4" />
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

      {/* ── PAGE 3: HMP TERMS AND CONDITIONS ─────────────────────────── */}
      <Pdf.Page size="letter" footer={
        <Pdf.Footer>
          <span className="text-[8px] text-gray-500">Canada Home Protect</span>
          <span className="text-[8px] text-gray-500">4/5</span>
          <span className="text-[8px] text-gray-500">PG4/5</span>
        </Pdf.Footer>
      }>
        <div className="px-8 py-4 text-[8px] text-gray-900 leading-snug font-sans">

          <div className="flex flex-row gap-5">
            {/* Left column */}
            <div className="flex-1 flex flex-col gap-1.5">

              <p className="font-bold">HOME MAINTENANCE PLAN (HMP) TERMS AND CONDITIONS</p>
              <p>The following Terms &amp; Conditions (which together with the Agreement Form to which they are appended are collectively referred to as this "Agreement") are the full and complete agreement with the Customer (the "Customer") being the name and signatory on the Home Maintenance Plan ("HMP") Agreement Form who is the person entering into this Agreement with Canada Home Protect ("CHP") along with Canada Home Protect and all of the Customer's utility bill, the Customer understands that each person shall be deemed the "Customer" and each person has the authority to enter into this Agreement. Each person shall be individually liable, and all of the Customers are collectively, jointly, and severally liable, for all obligations, liabilities and indebtedness imposed on Customer by this Agreement.</p>

              <p>1. APPOINTMENT OF AGENT: The Customer hereby appoints Canada Home Protect to be their agent and HMP supplier for all purposes related to the arrangement of HMP billing to the Service Address on this Agreement ("Appointment of Agent"). The Customer's utility provider and all other related third parties are entitled to rely upon all actions taken, or documents signed, by Canada Home Protect in connection with or pursuant to this Appointment of Agent as though the Customer had taken such action or signed such document himself/herself including, without limitation, the negotiation, implementation, operation, performance, amendment and termination of any HMP arrangement. This Appointment of Agent shall be effective from the date the Customer signs the Agreement and shall continue until CHP or the customer ends this agreement.</p>

              <p>2. OUR SERVICE COMMITMENT TO CUSTOMER: Canada Home Protect's commitment to the Customer is to offer maintenance services as outlined below in these Terms and Conditions. This Agreement shall take effect thirty (30) days after the date of this Agreement (the "Effective Date"). An emergency telephone number 1-833-347-0209 is available to the Customer 7 days a week, 24 hours a day to handle the dispatching of emergency service requirements.</p>

              <p>3. CUSTOMER'S COMMITMENT: Canada Home Protect will honour our Service Commitment in accordance with these terms and conditions and, in turn, the Customer agrees that: They represent and warrant that they have the authority to enter into this Agreement either as the owner of the Premises, or because they have been authorized to enter into this Agreement as such owner's duly authorized agent.</p>

              <p>4. DIRECTION AND EXCHANGE OF PERSONAL INFORMATION: By signing this agreement, I hereby direct and authorize Canada Home Protect to enter into arrangements on my behalf with my utility provider with regard to billing arrangements in conjunction with the HMP. In addition, I authorize and direct my utility provider and any related third party to release to Canada Home Protect all information in such person's possession and control relating to me, including but not limited to any related credit and payment history.</p>

              <p>5. REPLACEMENT PROGRAM: CHP will provide the customer with a credit of $500 (or equivalent in rental furnace/AC deferred payments/finance/buyout) towards the purchase/rental of a new replacement unit from Canada Home Protect. The Customer's maintenance plan is transferable to the new unit(s).</p>

              <p>6. GENERAL EXCLUSIONS: Repairs are not included as a part of any maintenance services provided hereunder. We are not responsible for any repairs resulting from any improperly installed units (installed by someone other than us). Any repairs or other service work required will only be performed with our express written consent. Any attempted repairs by us that do not resolve the issue will not result in any costs or liability being paid to customer. All plans described in these Terms and Conditions do not cover any costs, including diagnosis and service, repair, parts replacement or adjustment.</p>

              <p>7. BUILDING ZONING CODE REQUIREMENTS OR VIOLATIONS: If current building or other code violations are discovered before or during the diagnosis or repair of equipment, CHP shall not be required to repair or service the equipment until the Customer completes the necessary corrective work at their own expense. If additional costs are incurred in order to comply with local, provincial or federal law, CHP shall not be responsible for that additional expense. CHP is not responsible for service or repair of equipment when permits cannot be obtained and will not pay any costs relating to permits.</p>

              <p>8. HAZARDOUS MATERIALS: CHP shall not cover service involving hazardous or toxic materials, asbestos, lead or the disposal of refrigerants or contaminants.</p>

              <p>9. OTHER TERMS: Canada Home Protect will not reimburse the Customer for the costs of services, repairs or parts replacement performed by contractors that have not been authorized by Canada Home Protect in writing to perform such service. Canada Home Protect has the right to change, from time to time, any term of this Agreement, including any plan rates and charges by sending the Customer prior written notice of the change and such change will be effective 30 days after the date set out in that notice. If the Customer does not consent to a price change, the Agreement may be terminated without penalty. Scheduling maintenance bookings under the CHP</p>

            </div>

            {/* Right column */}
            <div className="flex-1 flex flex-col gap-1.5">

              <p>Maintenance Plan must be scheduled fourteen (14) days from the date the maintenance request is received by CHP.</p>

              <p>10. TERM AND CANCELLATION: The Customer's coverage under any plan shall be in effect for a fixed term of hundred and twenty (120) months commencing on the date of enrollment (the "Term"), unless otherwise terminated in accordance with this Agreement. Either Canada Home Protect ("CHP") or the Customer may terminate this Agreement upon written notice to the other party. Such termination shall take effect on the date the written notice is received unless otherwise stated in the notice. If the Customer cancels this Agreement prior to the completion of the 120-month Term without CHP's written consent and without providing valid cause and reason for cancellation, the Customer acknowledges and agrees that:</p>
              <p className="pl-3">1. <em>The entire remaining balance of payments due for the unexpired portion of the Term shall become immediately due and payable; and</em></p>
              <p className="mb-1 pl-3">2. <em>CHP may, at its discretion, report the outstanding balance and account status to Canadian credit bureaus and pursue recovery through collection channels.</em></p>
              <p>If CHP cancels this Agreement, its liability shall be limited to a refund, if any, of the unexpired portion of payments already made, and to the completion of any maintenance covered by the Customer's plan for which CHP has received notice prior to termination. If CHP is unable to enroll the Customer for billing purposes, CHP may cancel this Agreement and shall provide written notice of such cancellation to the Customer.</p>

              <p>11. BILLING: Pre-authorized Debit ("PAD") Payments: You authorize CHP to debit regular monthly payments and additional sporadic PADs for other charges under the Agreement or as authorized by you for your personal use. You waive any written notice before the first PAD is processed or when any change in the PAD amount is made because of an adjustment in the payment amount or other charges. You will advise CHP of any changes in the account information or other change in the preauthorization payment at least 10 business days prior to the next payment date. You may cancel this preauthorization at any time by sending a notice to CHP at least 10 business days prior to the next payment date. The cancellation of preauthorization applies only to the method of payment and will not change or terminate your obligations on this Agreement. You may obtain a sample cancellation form or more information on your right to cancel a PAD agreement by consulting your financial institution or by visiting www.cdnpay.ca. CHP can cancel this preauthorization by sending a 30-day notice to you. It can also be cancelled without notice if the financial institution refuses the PAD for any reason or</p>

              <p>you default under the Agreement. CHP may transfer this authorization to the person to whom it transfers this Agreement or any entitlements under the Agreement. You have certain rights of recourse if a PAD does not comply with the terms of this PAD Agreement. For example you have the right to receive reimbursement for any PAD that is not compatible with the terms of the agreement. For more information on your rights of recourse, you may consult with your financial institution or visit www.cdnpay.ca. If I fail to pay on time, I shall pay 1% interest per month (12% per annum) on the unpaid amount, from the due date of payment until the payment is received. I shall be responsible for all costs related to recovery of amounts I fail to pay, including dishonored cheques, legal and collection costs. You understand that on each annual anniversary of your installation date, your monthly payment may increase up to 5.0% of the rental amount payable in the preceding year.</p>

              <p>12. PRICING AND TERM: Price: I agree that the Price of the HMP shall be selected on the Agreement Form. I agree to pay the Price and I also agree to pay any administration fees charged to Canada Home Protect by my utility provider. The Price does not include federal, provincial and municipal taxes, including the HST, payable in connection with the HMP to the Service Address. Term: Subject to the termination rights contained in this Agreement, the term of this Agreement is for an indefinite period. To cancel this agreement, you must give notice of cancellation to CHP, at the address set out in the agreement, by any means that allows you to prove the date on which you gave notice. CHP has 15 days from the time of receiving your letter to cancel your agreement and discontinue billing.</p>

              <p>13. ELIGIBILITY HMP: coverage applies only to single family residence, be it a house, townhouse, condominium, apartment unit or modular unit.</p>

              <p>14. CHANGE OF INFORMATION OR SERVICE ADDRESS: If I plan to move to another location, I will notify Canada Home Protect in writing of my new Service Address at least 30 days in advance of the anticipated relocation date. Upon receipt of such notice, Canada Home Protect will advise me as to whether Canada Home Protect is prepared to continue HMP to my new Service Address, and if so, the terms of this Agreement shall apply to the new location. My utility provider may provide to Canada Home Protect a notification of a change of address within my utility provider's franchise area and when Canada Home Protect receives such notice it will use its best efforts to continue the program contemplated by this Agreement for the remaining term of this Agreement at the new Service Address. If Canada Home Protect is unable to transfer the Agreement to my New Address, this Agreement shall</p>

            </div>
          </div>

        </div>
      </Pdf.Page>

      {/* ── PAGE 4: HMP TERMS AND CONDITIONS (continued) ─────────────── */}
      <Pdf.Page size="letter" footer={
        <Pdf.Footer>
          <span className="text-[8px] text-gray-500">Canada Home Protect</span>
          <span className="text-[8px] text-gray-500">5/5</span>
          <span className="text-[8px] text-gray-500">PG5/5</span>
        </Pdf.Footer>
      }>
        <div className="px-8 py-4 text-[8px] text-gray-900 leading-snug font-sans">

          <div className="flex flex-row gap-5">
            {/* Left column */}
            <div className="flex-1 flex flex-col gap-1.5">

              <p>automatically cancelled without penalty. I also agree to notify Canada Home Protect in writing of any other change of information (including a change of account number, contract information or Mailing Address) at least 60 days prior to such change taking effect or immediately if the change is to take effect in less than 60 days.</p>

              <p><strong>15. LIQUIDATED DAMAGES</strong> If Canada Home Protect terminates this Agreement because I am in default, I agree to pay Canada Home Protect, in addition to all other amounts owing by me hereunder at the date of such termination, damages equal to the amount of $100 per HMP (heating, cooling or plumbing) or $200 for a Combo Maintenance Plan. The Damages are hereby conclusively deemed to be liquidated damages and shall not, under any circumstances, be construed as a penalty. I authorize my utility provider to include the Damages in my utility provider's bill as an amount payable to Canada Home Protect.</p>

              <p><strong>16. ASSIGNMENT</strong> Canada Home Protect may, in its sole discretion, pledge, assign or otherwise transfer all or any of its rights or obligations under this Agreement or any proceeds arising pursuant to this Agreement without my consent. I shall not pledge, assign or otherwise transfer all or any of my rights or obligations under this Agreement. This Agreement shall be binding upon and shall ensure to the benefit of the successors and assigns of Canada Home Protect and myself.</p>

              <p><strong>17. UNAVAILABLE PARTS and PART REPLACEMENT</strong> If a part is unavailable, Canada Home Protect will attempt to obtain a replacement part or an equivalent substitute as quickly as possible, but limited availability of certain parts may result in delays from time to time. In the unusual event that Canada Home Protect cannot provide a part replacement or an equivalent substitute, Canada Home Protect will not be liable for such part replacement, equivalent substitute or for any resulting damages. Parts replacement or equivalent substitutes are solely at Canada Home Protect's discretion. Any part that is found to be defective and is replaced under your plan coverage becomes Canada Home Protect's sole property and may be disposed of at Canada Home Protect's discretion.</p>

              <p><strong>18. LIMIT ON LIABILITY</strong> Canada Home Protect is not the manufacturer or supplier of the Heating Unit or the Cooling Unit or plumbing system and Canada Home Protect makes no representations, warranties or conditions as to the performance of any unit(s). Canada Home Protect will not be liable for any loss, damage or injury of any type arising out of or related to this Agreement or caused or contributed in any way by the use and operation of the Heating Unit and/or the Cooling Unit and/or plumbing system or any indirect incidental, special or consequential damages even if reasonably foreseeable. If Canada Home Protect is not able to perform any of its obligations under this Agreement because of circumstances or events beyond its control, Canada Home Protect shall be excused from the performance of such obligations for the duration of such circumstances or events and Canada Home Protect shall not be liable to the Customer for such failure to perform. In addition to the General Exclusions in s.7 of this Agreement, the plans do not cover any losses, repairs or replacements arising from abuse, accidental or deliberate damage, theft, vandalism, fire, flood, earthquake, other natural disasters, acts of war, acts of God, unauthorized repair, if the equipment has been turned off, improper thermostat setting, or household electrical problems. The Customer agrees to indemnify Canada Home Protect from all claims, losses and costs that Canada Home Protect may suffer or pay, or may be required to pay, including legal expenses, in connection with the Heating Unit, the Cooling Unit, the plumbing system, this Agreement or the use and operation of either unit or system, including any claims against Canada Home Protect for any injury or death to individuals or damage to property. The Customer will pay, when due, all taxes and other charges imposed by any governmental or regulatory authority or in connection with this Agreement or your payments made under it.</p>

              <p><strong>19. AMENDMENTS</strong> Canada Home Protect may amend this Agreement at any time by providing the Customer with written notice of the necessary changes or amendments and this Agreement shall be amended 30 days after the date of such notice.</p>

            </div>

            {/* Right column */}
            <div className="flex-1 flex flex-col gap-1.5">

              <p>a waiver of its rights under any other provision of this Agreement, regardless of whether such provision is of the same or a similar nature. These offers and claims are made by Canada Home Protect alone. All other territories will be billed through Pre-authorized Debit payments.</p>

              <p><strong>21. PRIVACY/RELEASE OF INFORMATION</strong> The Customer acknowledges that Canada Home Protect may collect, record, use and disclose the Customer's credit, financial and related personal information for purposes related to our business and the Customer consents to our disclosure or exchange information with credit bureaus, financial institutions, service providers, agents, affiliates and other third parties in connection with this Agreement. The Customer also consents to our use of this information for the purposes of evaluating the Customer's creditworthiness, providing the Customer with products and services under this Agreement, verifying information the Customer provides to Canada Home Protect, establishing, servicing and collecting on the Customer's account, offering the Customer other products and services, and meeting legal, regulatory, audit, processing and security requirements. The Customer understands that they can provide Canada Home Protect with notice at any time to stop using their personal information except as required by law or regulation, or as needed for the administration of the Customer's HMP. For more information about our privacy policy, please see www.canadahomeprotect.ca.</p>

              <p><strong>22. CANADA HOME PROTECT CONTACT INFORMATION</strong> If I have any questions or concerns, I can contact Canada Home Protect by telephone at 1-833-347-0209 or e-mail at admin@canadahomeprotect.ca or by facsimile, mail, or by personal delivery. Please address all written correspondence to Manager, Customer Service – Home Maintenance Plans.</p>

              <p><strong>23. YOUR RIGHTS UNDER THE CONSUMER PROTECTION ACT, 2002</strong> You may cancel this agreement at any time during the period that ends ten (10) days after the day you receive a written copy of the agreement. You do not need to give CHP a reason for canceling during this 10-day period. If CHP does not make delivery within 30 days after the delivery date specified in this agreement or if CHP does not begin performance of its obligations within 30 days after the commencement date specified in this agreement, you may cancel this agreement at any time before delivery or commencement of performance. You lose the right to cancel if, after the 30-day period has expired, you agree to accept delivery or authorize commencement of performance. If the delivery date or commencement date is not specified in this agreement and CHP does not deliver or commence performance within 30 days after the date this agreement is entered into, you may cancel this agreement at any time before delivery of commencement of performance. You lose the right to cancel if, after the 30-day period has expired, you agree to accept delivery or authorize commencement of performance. In addition, there are other grounds that allow you to cancel this agreement. You may also have other rights, duties and remedies at law. For more information, you may contact the Ministry of Consumer and Business Services. To cancel this agreement, you must give notice of cancellation to CHP, at the address set out in the agreement, by any means that allows you to prove the date on which you gave notice. If no address is set out in the agreement, use any address of the supplier that is on record with the Government of Ontario or the Government of Canada or is known by you. If you cancel this agreement, CHP has fifteen (15) days to refund any payment you have made and return to you all goods delivered under a trade-in arrangement (or refund an amount equal to the trade-in allowance). However, if you cancel this agreement after having solicited the goods or services from CHP and having requested that delivery be made or performance be commenced within ten (10) days after the date this agreement is entered into, CHP is entitled to reasonable compensation for the goods and services that you received before the earlier of the 11th day after the date this agreement was entered into and the date on which you gave notice of cancellation to CHP, except goods that can be repossessed by or returned to CHP.</p>

              <p>MISCELLANEOUS This Agreement is binding upon and will ensure to the Customer's respective heirs, personal representatives, successors and permitted assigns. Except as specifically provided for herein, the Customer may not assign this Agreement to anyone without Canadian Home Maintenance's prior written consent. This Agreement is the entire agreement between Canada Home Protect and the Customer. It is governed by the laws of the Province of Ontario. Should any of the terms and conditions in this Agreement be held invalid for any reason by a Court or regulatory/government body of competent jurisdiction, then such terms or conditions shall be deemed severed from this Agreement and the remaining terms and conditions shall continue in full force and effect. Failure of either party at any time to require performance by the other party of any provision in this Agreement shall not be deemed to be a continuing waiver of that provision, or a waiver of its rights under any other provision of this Agreement, regardless of whether such provision is of the same or a similar nature. These offers and claims are made by Canada Home Protect alone. All other territories will be billed through Pre-authorized Debit payments.</p>

            </div>
          </div>

        </div>
      </Pdf.Page>

    </Pdf.Document>
  );
}
