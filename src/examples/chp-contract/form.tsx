import { useForm } from 'react-hook-form';
import { Pdf, InputField } from '../../index';
import { PdfPreview } from '../../components/PdfPreview';

// Page 2 of the CHP contract (450pt × 792pt = 600px × 1056px in the original).
// Using letter size here (816px × 1056px); all fields fall within the first 600px.
// Coordinates computed from PDF: x_px = x_pt * 96/72, y_px = (792 - y_pt - h_pt) * 96/72.

interface FormValues {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  cocustomer_first_name: string;
  cocustomer_last_name: string;
  cocustomer_date_of_birth: string;
  address: string;
  unit: string;
  city: string;
  province: string;
  email: string;
  postal_code: string;
  home_phone: string;
  mobile_or_office: string;
  start_date: string;
  customer_signature: string;
  customer_full_name: string;
  customer_date_of_signature: string;
  cocustomer_full_name: string;
  cocustomer_date_of_signature: string;
  customer_place_of_execution: string;
  cocustomer_place_of_execution: string;
  dealer_rep_name: string;
  dealer_name_and_phone_number: string;
}

const row = 'flex flex-row divide-x-2 divide-gray-800'
const block = 'border-2 border-gray-800 divide-y-2 divide-gray-800'

export default function CHPContractPage2() {
  const { register, watch, handleSubmit } = useForm<FormValues>({
    values: {
      first_name: '',
      last_name: '',
      province: '',
    } as FormValues,
  });

  const v = watch();

  return (
    <form onSubmit={handleSubmit((data) => console.log('submit', data))}>
      <Pdf.Document>
        <Pdf.Page size="letter">

          <div className="w-full bg-gray-100 uppercase tracking-normal text-gray-800 font-bold py-1 px-2">
            Homeowner Information
          </div>

          {/* ── CUSTOMER INFORMATION ─────────────────────────────────────── */}
          <Pdf.Box className={block}>
            <div className={row}>
              <InputField {...register('first_name')} name="p2.first_name" label="First Name" type="text" defaultValue={v.first_name} />
              <InputField {...register('last_name')} name="p2.last_name" label="Last Name" type="text" defaultValue={v.last_name} />
              <InputField {...register('date_of_birth')} name="p2.date_of_birth" label="Date of Birth" type="date" defaultValue={v.date_of_birth} />
            </div>
            <div className={row}>
              <InputField {...register('cocustomer_first_name')} name="p2.cocustomer_first_name" label="Co-Customer First Name" type="text" defaultValue={v.cocustomer_first_name} />
              <InputField {...register('cocustomer_last_name')} name="p2.cocustomer_last_name" label="Last Name" type="text" defaultValue={v.cocustomer_last_name} />
              <InputField {...register('cocustomer_date_of_birth')} name="p2.cocustomer_date_of_birth" label="Date of Birth" type="date" defaultValue={v.cocustomer_date_of_birth} />
            </div>
          </Pdf.Box>

          {/* ── ADDRESS ──────────────────────────────────────────────────── */}
          <Pdf.Box className={`${block} -mt-0.5`}>
            <div className={row}>
              <InputField {...register('address')} name="p2.address" label="Address" type="text" defaultValue={v.address} />
              <InputField {...register('unit')} name="p2.unit" label="Unit #" type="text" defaultValue={v.unit} containerClassName="max-w-32" />
            </div>
            <div className={row}>
              <InputField {...register('city')} name="p2.city" label="City" type="text" defaultValue={v.city} />
              <InputField {...register('province')} name="p2.province" label="Prov" type="text" defaultValue={v.province} containerClassName="max-w-16" />
              <InputField {...register('email')} name="p2.email" label="Email" type="text" defaultValue={v.email} />
            </div>
            <div className={row}>
              <InputField {...register('postal_code')} name="p2.postal_code" label="Postal Code" type="text" defaultValue={v.postal_code} />
              <InputField {...register('home_phone')} name="p2.home_phone" label="Home Phone" type="text" defaultValue={v.home_phone} />
              <InputField {...register('mobile_or_office')} name="p2.mobile_or_office" label="Mobile/Office" type="text" defaultValue={v.mobile_or_office} />
            </div>
          </Pdf.Box>

          {/* ── PLAN & START DATE ─────────────────────────────────────────── */}
          <Pdf.Box className={`${block} -mt-0.5`}>
            <div className={row}>
              <InputField {...register('start_date')} name="p2.start_date" label="Start Date" type="date" defaultValue={v.start_date} containerClassName="max-w-36" />
            </div>
          </Pdf.Box>

          {/* ── CUSTOMER SIGNATURE BLOCK ─────────────────────────────────── */}
          <Pdf.Box className={`${block} -mt-0.5`}>
            <div className={row}>
              <InputField {...register('customer_signature')} name="p2.customer_signature" label="Customer Signature" type="text" defaultValue={v.customer_signature} />
            </div>
            <div className={row}>
              <InputField {...register('customer_full_name')} name="p2.customer_full_name" label="Name" type="text" defaultValue={v.customer_full_name} />
              <InputField {...register('customer_date_of_signature')} name="p2.customer_date_of_signature" label="Date" type="date" defaultValue={v.customer_date_of_signature} />
              <InputField {...register('cocustomer_full_name')} name="p2.cocustomer_full_name" label="Co-Customer Name" type="text" defaultValue={v.cocustomer_full_name} />
              <InputField {...register('cocustomer_date_of_signature')} name="p2.cocustomer_date_of_signature" label="Date" type="date" defaultValue={v.cocustomer_date_of_signature} />
            </div>
            <div className={row}>
              <InputField {...register('customer_place_of_execution')} name="p2.customer_place_of_execution" label="City of Execution" type="text" defaultValue={v.customer_place_of_execution} />
              <InputField {...register('cocustomer_place_of_execution')} name="p2.cocustomer_place_of_execution" label="Co-Customer City of Execution" type="text" defaultValue={v.cocustomer_place_of_execution} />
            </div>
          </Pdf.Box>

          {/* ── DEALER INFORMATION ───────────────────────────────────────── */}
          <Pdf.Box className={`${block} -mt-0.5`}>
            <div className={row}>
              <InputField {...register('dealer_rep_name')} name="p2.dealer_rep_name" label="Dealer Rep Name" type="text" defaultValue={v.dealer_rep_name} />
              <InputField {...register('dealer_name_and_phone_number')} name="p2.dealer_name_and_phone_number" label="Dealer Name & Phone" type="text" defaultValue={v.dealer_name_and_phone_number} />
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
      <PdfPreview />
    </form>
  );
}
