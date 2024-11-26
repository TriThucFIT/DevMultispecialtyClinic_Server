const record = {
    id: 2,
    patient: {
      fullName: 'Bùi Trí Thức',
      age: 22,
      priority: 3,
      patientId: 'PAT06',
      phone: '0963015348',
      address: {
        city: 'Cà Mau',
        state: 'Đầm Dơi',
        address: '333 ấp Thuận Hòa, Xã Tân Đức'
      },
      dob: '2002-06-15',
      gender: true
    },
    notes: 'heheheheheheheheheheheeh',
    entries: [
      {
        id: 1,
        symptoms: 'heheheheheheheheheheheeh',
        doctor: {
          employeeId: 'DOC_2404',
          phone: '0988088099',
          fullName: 'Hùng Quân Singer',
          address: null,
          gender: false,
          dob: '1995-04-24'
        },
        visitDate: '2024-11-25T17:36:54.000Z',
        diagnosis: 'Viêm họng cấp',
        treatmentPlan: 'Nghỉ ngơi, uống nhiều nước, dùng thuốc theo đơn',
        prescriptions: [
          {
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: '4 lần/ngày'
          },
          {
            name: 'Vitamin C',
            dosage: '1000mg',
            frequency: '1 lần/ngày'
          }
        ],
        notes: 'Bệnh nhân cần tái khám sau 3 ngày nếu các triệu chứng không thuyên giảm',
        labRequests: [
          {
            labTest: {
              name: 'Xét Nghiệm Máu',
              price: 120000
            },
            requestDate: '2024-11-26T08:49:01.000Z',
            status: 'completed',
            testResult: {
              result: 'Normal',
              detail: [
                {
                  name: 'Hemoglobin',
                  unit: 'g/dL',
                  range: '12.0-16.0',
                  value: 13.5,
                  status: 'Normal'
                },
                {
                  name: 'WBC',
                  unit: 'x10^9/L',
                  range: '4.0-11.0',
                  value: 6.1,
                  status: 'Normal'
                },
                {
                  name: 'Platelets',
                  unit: 'x10^9/L',
                  range: '150-450',
                  value: 250,
                  status: 'Normal'
                },
                {
                  name: 'RBC',
                  unit: 'x10^12/L',
                  range: '4.0-5.5',
                  value: 4.7,
                  status: 'Normal'
                },
                {
                  name: 'Glucose',
                  unit: 'mg/dL',
                  range: '70-100',
                  value: 95,
                  status: 'Normal'
                }
              ],
              notes:
                'Kết quả xét nghiệm máu của bệnh nhân nằm trong giới hạn bình thường. Không phát hiện bất thường.'
            }
          },
          {
            labTest: {
              name: 'Xét Nghiệm Nước Tiểu',
              price: 80000
            },
            requestDate: '2024-11-26T08:49:01.000Z',
            status: 'pending',
            testResult: null
          }
        ]
      }
    ]
  }