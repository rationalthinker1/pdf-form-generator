import { Pdf } from '@pdf-form/core'

// Page 2 of the CHP contract (450pt × 792pt = 600px × 1056px in the original).
// Using letter size here (816px × 1056px); all fields fall within the first 600px.
// Coordinates computed from PDF: x_px = x_pt * 96/72, y_px = (792 - y_pt - h_pt) * 96/72.

export default function CHPContractPage2() {
  return (
    <Pdf.Document>
      <Pdf.Page size="letter">

        {/* ── CUSTOMER INFORMATION ─────────────────────────────────────── */}

        {/* First Name */}
        <div style={{ position: 'absolute', left: 19, top: 110 }}>
          <Pdf.Text fontSize={7} color="#6b7280">CUSTOMER FIRST NAME</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 19, top: 122, width: 204 }}>
          <Pdf.TextField name="p2.first_name" label="First Name" />
        </div>

        {/* Last Name */}
        <div style={{ position: 'absolute', left: 227, top: 110 }}>
          <Pdf.Text fontSize={7} color="#6b7280">LAST NAME</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 227, top: 122, width: 208 }}>
          <Pdf.TextField name="p2.last_name" label="Last Name" />
        </div>

        {/* Date of Birth */}
        <div style={{ position: 'absolute', left: 492, top: 102 }}>
          <Pdf.Text fontSize={7} color="#6b7280">DATE OF BIRTH</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 492, top: 114, width: 99 }}>
          <Pdf.TextField name="p2.date_of_birth" label="MM/DD/YYYY" />
        </div>

        {/* ── CO-CUSTOMER INFORMATION ──────────────────────────────────── */}

        {/* Co-customer First Name */}
        <div style={{ position: 'absolute', left: 19, top: 137 }}>
          <Pdf.Text fontSize={7} color="#6b7280">CO-CUSTOMER FIRST NAME</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 19, top: 149, width: 203 }}>
          <Pdf.TextField name="p2.cocustomer_first_name" label="First Name" />
        </div>

        {/* Co-customer Last Name */}
        <div style={{ position: 'absolute', left: 228, top: 137 }}>
          <Pdf.Text fontSize={7} color="#6b7280">LAST NAME</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 228, top: 149, width: 207 }}>
          <Pdf.TextField name="p2.cocustomer_last_name" label="Last Name" />
        </div>

        {/* Co-customer Date of Birth */}
        <div style={{ position: 'absolute', left: 493, top: 129 }}>
          <Pdf.Text fontSize={7} color="#6b7280">DATE OF BIRTH</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 493, top: 141, width: 97 }}>
          <Pdf.TextField name="p2.cocustomer_date_of_birth" label="MM/DD/YYYY" />
        </div>

        {/* ── ADDRESS ──────────────────────────────────────────────────── */}

        {/* Address */}
        <div style={{ position: 'absolute', left: 19, top: 165 }}>
          <Pdf.Text fontSize={7} color="#6b7280">ADDRESS</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 19, top: 177, width: 416 }}>
          <Pdf.TextField name="p2.address" label="Street Address" />
        </div>

        {/* Unit */}
        <div style={{ position: 'absolute', left: 442, top: 165 }}>
          <Pdf.Text fontSize={7} color="#6b7280">UNIT #</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 442, top: 177, width: 148 }}>
          <Pdf.TextField name="p2.unit" label="Unit" />
        </div>

        {/* City */}
        <div style={{ position: 'absolute', left: 20, top: 191 }}>
          <Pdf.Text fontSize={7} color="#6b7280">CITY</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 20, top: 203, width: 202 }}>
          <Pdf.TextField name="p2.city" label="City" />
        </div>

        {/* Province */}
        <div style={{ position: 'absolute', left: 260, top: 191 }}>
          <Pdf.Text fontSize={7} color="#6b7280">PROV</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 260, top: 203, width: 37 }}>
          <Pdf.TextField name="p2.province" label="ON" />
        </div>

        {/* Email */}
        <div style={{ position: 'absolute', left: 302, top: 191 }}>
          <Pdf.Text fontSize={7} color="#6b7280">EMAIL</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 302, top: 203, width: 289 }}>
          <Pdf.TextField name="p2.email" label="email@example.com" />
        </div>

        {/* ── CONTACT ──────────────────────────────────────────────────── */}

        {/* Postal Code */}
        <div style={{ position: 'absolute', left: 71, top: 211 }}>
          <Pdf.Text fontSize={7} color="#6b7280">POSTAL CODE</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 71, top: 223, width: 149 }}>
          <Pdf.TextField name="p2.postal_code" label="A1A 1A1" />
        </div>

        {/* Home Phone */}
        <div style={{ position: 'absolute', left: 276, top: 213 }}>
          <Pdf.Text fontSize={7} color="#6b7280">HOME PHONE</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 276, top: 225, width: 159 }}>
          <Pdf.TextField name="p2.home_phone" label="(000) 000-0000" />
        </div>

        {/* Mobile/Office */}
        <div style={{ position: 'absolute', left: 507, top: 213 }}>
          <Pdf.Text fontSize={7} color="#6b7280">MOBILE/OFFICE</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 507, top: 225, width: 84 }}>
          <Pdf.TextField name="p2.mobile_or_office" label="(000) 000-0000" />
        </div>

        {/* ── PLAN & START DATE ─────────────────────────────────────────
            Checkboxes (premium plan, PAD payment options) appear between
            y=287 and y=497 in the original but require a Checkbox component
            not yet available. Only the start date text field is included. */}

        {/* Start Date */}
        <div style={{ position: 'absolute', left: 475, top: 425 }}>
          <Pdf.Text fontSize={7} color="#6b7280">START DATE</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 475, top: 437, width: 116 }}>
          <Pdf.TextField name="p2.start_date" label="MM/DD/YYYY" />
        </div>

        {/* ── CUSTOMER SIGNATURE BLOCK ─────────────────────────────────── */}

        {/* Customer Signature */}
        <div style={{ position: 'absolute', left: 26, top: 807 }}>
          <Pdf.Text fontSize={7} color="#6b7280">CUSTOMER SIGNATURE</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 26, top: 819, width: 153, height: 33 }}>
          <Pdf.TextField name="p2.customer_signature" label="" />
        </div>

        {/* Customer Print Name */}
        <div style={{ position: 'absolute', left: 26, top: 858 }}>
          <Pdf.Text fontSize={7} color="#6b7280">PRINT NAME</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 26, top: 870, width: 159 }}>
          <Pdf.TextField name="p2.customer_full_name" label="Full Name" />
        </div>

        {/* Customer Date of Signature */}
        <div style={{ position: 'absolute', left: 189, top: 857 }}>
          <Pdf.Text fontSize={7} color="#6b7280">DATE</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 189, top: 869, width: 111 }}>
          <Pdf.TextField name="p2.customer_date_of_signature" label="MM/DD/YYYY" />
        </div>

        {/* Co-customer Print Name */}
        <div style={{ position: 'absolute', left: 315, top: 857 }}>
          <Pdf.Text fontSize={7} color="#6b7280">CO-CUSTOMER PRINT NAME</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 315, top: 869, width: 178 }}>
          <Pdf.TextField name="p2.cocustomer_full_name" label="Full Name" />
        </div>

        {/* Co-customer Date of Signature */}
        <div style={{ position: 'absolute', left: 496, top: 857 }}>
          <Pdf.Text fontSize={7} color="#6b7280">DATE</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 496, top: 869, width: 83 }}>
          <Pdf.TextField name="p2.cocustomer_date_of_signature" label="MM/DD/YYYY" />
        </div>

        {/* ── PLACE OF EXECUTION ───────────────────────────────────────── */}

        {/* Customer City of Execution */}
        <div style={{ position: 'absolute', left: 92, top: 906 }}>
          <Pdf.Text fontSize={7} color="#6b7280">CITY OF EXECUTION</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 92, top: 918, width: 108 }}>
          <Pdf.TextField name="p2.customer_place_of_execution" label="City" />
        </div>

        {/* Co-customer City of Execution */}
        <div style={{ position: 'absolute', left: 382, top: 903 }}>
          <Pdf.Text fontSize={7} color="#6b7280">CITY OF EXECUTION</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 382, top: 915, width: 108 }}>
          <Pdf.TextField name="p2.cocustomer_place_of_execution" label="City" />
        </div>

        {/* ── DEALER INFORMATION ───────────────────────────────────────── */}

        {/* Dealer Rep Name */}
        <div style={{ position: 'absolute', left: 196, top: 950 }}>
          <Pdf.Text fontSize={7} color="#6b7280">DEALER REP NAME</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 196, top: 962, width: 199 }}>
          <Pdf.TextField name="p2.dealer_rep_name" label="Rep Name" />
        </div>

        {/* Dealer Name & Phone */}
        <div style={{ position: 'absolute', left: 397, top: 950 }}>
          <Pdf.Text fontSize={7} color="#6b7280">DEALER NAME &amp; PHONE</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 397, top: 962, width: 191 }}>
          <Pdf.TextField name="p2.dealer_name_and_phone_number" label="Company (000) 000-0000" />
        </div>

      </Pdf.Page>
    </Pdf.Document>
  )
}
