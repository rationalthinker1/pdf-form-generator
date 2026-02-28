import { Pdf } from '@pdf-form/core';

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
          }}
        >
          <Pdf.Text fontSize={18} bold color="#1f2937">HVAC Service Contract</Pdf.Text>
        </div>

        {/* Customer Name */}
        <div style={{ position: 'absolute', left: 48, top: 100 }}>
          <Pdf.Text fontSize={11} color="#6b7280">CUSTOMER NAME</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 48, top: 116, width: 300 }}>
          <Pdf.TextField name="customerName" label="Full Name" />
        </div>

        {/* Date */}
        <div style={{ position: 'absolute', left: 380, top: 100 }}>
          <Pdf.Text fontSize={11} color="#6b7280">DATE</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 380, top: 116, width: 180 }}>
          <Pdf.TextField name="serviceDate" label="MM/DD/YYYY" />
        </div>

        {/* Service Address */}
        <div style={{ position: 'absolute', left: 48, top: 168 }}>
          <Pdf.Text fontSize={11} color="#6b7280">SERVICE ADDRESS</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 48, top: 184, width: 512 }}>
          <Pdf.TextField name="serviceAddress" label="Street Address" />
        </div>

        {/* Technician */}
        <div style={{ position: 'absolute', left: 48, top: 236 }}>
          <Pdf.Text fontSize={11} color="#6b7280">TECHNICIAN</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 48, top: 252, width: 240 }}>
          <Pdf.TextField name="technicianName" label="Technician Name" />
        </div>

        {/* Work Description */}
        <div style={{ position: 'absolute', left: 48, top: 316 }}>
          <Pdf.Text fontSize={11} color="#6b7280">WORK DESCRIPTION</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 48, top: 332, width: 512, height: 120 }}>
          <Pdf.TextField name="workDescription" label="Describe work performed..." />
        </div>

        {/* Total Amount */}
        <div style={{ position: 'absolute', left: 380, top: 480 }}>
          <Pdf.Text fontSize={11} color="#6b7280">TOTAL AMOUNT</Pdf.Text>
        </div>
        <div style={{ position: 'absolute', left: 380, top: 496, width: 180 }}>
          <Pdf.TextField name="totalAmount" label="$0.00" />
        </div>
      </Pdf.Page>
    </Pdf.Document>
  );
}
