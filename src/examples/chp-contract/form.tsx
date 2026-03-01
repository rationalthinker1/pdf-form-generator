import { Pdf, InputField } from '../../index';

// Page 2 of the CHP contract (450pt × 792pt = 600px × 1056px in the original).
// Using letter size here (816px × 1056px); all fields fall within the first 600px.
// Coordinates computed from PDF: x_px = x_pt * 96/72, y_px = (792 - y_pt - h_pt) * 96/72.

const row = 'flex flex-row divide-x-2 divide-gray-800'
const block = 'border-2 border-gray-800 divide-y-2 divide-gray-800'

export default function CHPContractPage2() {
  return (
    <Pdf.Document>
      <Pdf.Page size="letter">

        <div className="w-full bg-gray-100 uppercase tracking-normal text-gray-800 font-bold py-1 px-2">
          Homeowner Information
        </div>

        {/* ── CUSTOMER INFORMATION ─────────────────────────────────────── */}
        <Pdf.Box className={block}>
          <div className={row}>
            <InputField name="p2.first_name" label="First Name" type="text" />
            <InputField name="p2.last_name" label="Last Name" type="text" />
            <InputField name="p2.date_of_birth" label="Date of Birth" type="date" />
          </div>
          <div className={row}>
            <InputField name="p2.cocustomer_first_name" label="Co-Customer First Name" type="text" />
            <InputField name="p2.cocustomer_last_name" label="Last Name" type="text" />
            <InputField name="p2.cocustomer_date_of_birth" label="Date of Birth" type="date" />
          </div>
        </Pdf.Box>

        {/* ── ADDRESS ──────────────────────────────────────────────────── */}
        <Pdf.Box className={`${block} -mt-0.5`}>
          <div className={row}>
            <InputField name="p2.address" label="Address" type="text" />
            <InputField name="p2.unit" label="Unit #" type="text" containerClassName="max-w-32" />
          </div>
          <div className={row}>
            <InputField name="p2.city" label="City" type="text" />
            <InputField name="p2.province" label="Prov" type="text" containerClassName="max-w-16" />
            <InputField name="p2.email" label="Email" type="text" />
          </div>
          <div className={row}>
            <InputField name="p2.postal_code" label="Postal Code" type="text" />
            <InputField name="p2.home_phone" label="Home Phone" type="text" />
            <InputField name="p2.mobile_or_office" label="Mobile/Office" type="text" />
          </div>
        </Pdf.Box>

        {/* ── PLAN & START DATE ─────────────────────────────────────────── */}
        <Pdf.Box className={`${block} -mt-0.5`}>
          <div className={row}>
            <InputField name="p2.start_date" label="Start Date" type="date" containerClassName="max-w-36" />
          </div>
        </Pdf.Box>

        {/* ── CUSTOMER SIGNATURE BLOCK ─────────────────────────────────── */}
        <Pdf.Box className={`${block} -mt-0.5`}>
          <div className={row}>
            <InputField name="p2.customer_signature" label="Customer Signature" type="text" />
          </div>
          <div className={row}>
            <InputField name="p2.customer_full_name" label="Name" type="text" />
            <InputField name="p2.customer_date_of_signature" label="Date" type="date" />
            <InputField name="p2.cocustomer_full_name" label="Co-Customer Name" type="text" />
            <InputField name="p2.cocustomer_date_of_signature" label="Date" type="date" />
          </div>
          <div className={row}>
            <InputField name="p2.customer_place_of_execution" label="City of Execution" type="text" />
            <InputField name="p2.cocustomer_place_of_execution" label="Co-Customer City of Execution" type="text" />
          </div>
        </Pdf.Box>

        {/* ── DEALER INFORMATION ───────────────────────────────────────── */}
        <Pdf.Box className={`${block} -mt-0.5`}>
          <div className={row}>
            <InputField name="p2.dealer_rep_name" label="Dealer Rep Name" type="text" />
            <InputField name="p2.dealer_name_and_phone_number" label="Dealer Name & Phone" type="text" />
          </div>
        </Pdf.Box>

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
