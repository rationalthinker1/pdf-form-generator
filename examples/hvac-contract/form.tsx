import { Pdf } from '@pdf-form/core'

export default function HvacContract() {
  return (
    <Pdf.Document>
      <Pdf.Page size="letter">
        {/* Header */}
        <div
          style={{
            position: 'absolute',
            left: 48,
            top: 48,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1f2937',
          }}
        >
          HVAC Service Contract
        </div>

        {/* Customer Name */}
        <div style={{ position: 'absolute', left: 48, top: 100, fontSize: 11, color: '#6b7280' }}>
          CUSTOMER NAME
        </div>
        <div style={{ position: 'absolute', left: 48, top: 116, width: 300 }}>
          <Pdf.TextField name="customerName" label="Full Name" />
        </div>

        {/* Date */}
        <div style={{ position: 'absolute', left: 380, top: 100, fontSize: 11, color: '#6b7280' }}>
          DATE
        </div>
        <div style={{ position: 'absolute', left: 380, top: 116, width: 180 }}>
          <Pdf.TextField name="serviceDate" label="MM/DD/YYYY" />
        </div>

        {/* Service Address */}
        <div style={{ position: 'absolute', left: 48, top: 168, fontSize: 11, color: '#6b7280' }}>
          SERVICE ADDRESS
        </div>
        <div style={{ position: 'absolute', left: 48, top: 184, width: 512 }}>
          <Pdf.TextField name="serviceAddress" label="Street Address" />
        </div>

        {/* Technician */}
        <div style={{ position: 'absolute', left: 48, top: 236, fontSize: 11, color: '#6b7280' }}>
          TECHNICIAN
        </div>
        <div style={{ position: 'absolute', left: 48, top: 252, width: 240 }}>
          <Pdf.TextField name="technicianName" label="Technician Name" />
        </div>

        {/* Work Description */}
        <div style={{ position: 'absolute', left: 48, top: 316, fontSize: 11, color: '#6b7280' }}>
          WORK DESCRIPTION
        </div>
        <div style={{ position: 'absolute', left: 48, top: 332, width: 512, height: 120 }}>
          <Pdf.TextField name="workDescription" label="Describe work performed..." />
        </div>

        {/* Total Amount */}
        <div style={{ position: 'absolute', left: 380, top: 480, fontSize: 11, color: '#6b7280' }}>
          TOTAL AMOUNT
        </div>
        <div style={{ position: 'absolute', left: 380, top: 496, width: 180 }}>
          <Pdf.TextField name="totalAmount" label="$0.00" />
        </div>
      </Pdf.Page>
    </Pdf.Document>
  )
}
