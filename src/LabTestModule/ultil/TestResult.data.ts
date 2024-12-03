export const TestResultData = {
  labResults: [
    {
      id: 'XRay',
      name: 'Chụp X Quang Tim, Phổi',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Phổi',
              description: 'Không có dấu hiệu viêm hoặc tổn thương.',
              status: 'Bình thường',
            },
            {
              name: 'Tim',
              description: 'Tim có kích thước bình thường.',
              status: 'Bình thường',
            },
          ],
          notes: 'Không phát hiện bất thường trên hình ảnh X-quang.',
          images: [
            'https://www.vinmec.com/static/uploads/small_20200614_155010_387631_xquangphoi_max_1800x1800_jpeg_7273a88b5f.jpg',
            'https://login.medlatec.vn//ckfinder/userfiles/images/chup-x-quang-tim-phoi-2.jpg',
          ],
        },
        {
          result: 'Bất thường nhẹ',
          detail: [
            {
              name: 'Phổi',
              description: 'Có dấu hiệu tổn thương nhẹ ở phổi phải.',
              status: 'Bất thường',
            },
          ],
          notes: 'Cần kiểm tra thêm để xác định nguyên nhân.',
          images: [
            'https://www.vinmec.com/static/uploads/small_20200614_155010_387631_xquangphoi_max_1800x1800_jpeg_7273a88b5f.jpg',
            'https://login.medlatec.vn//ckfinder/userfiles/images/chup-x-quang-tim-phoi-2.jpg',
          ],
        },
        {
          result: 'Nghiêm trọng',
          detail: [
            {
              name: 'Tim',
              description: 'Tim to bất thường, nghi ngờ suy tim.',
              status: 'Nghiêm trọng',
            },
          ],
          notes: 'Cần chuyển bệnh nhân đến bác sĩ chuyên khoa tim mạch.',
          images: [
            'https://www.vinmec.com/static/uploads/small_20200614_155010_387631_xquangphoi_max_1800x1800_jpeg_7273a88b5f.jpg',
            'https://login.medlatec.vn//ckfinder/userfiles/images/chup-x-quang-tim-phoi-2.jpg',
          ],
        },
      ],
    },
    {
      id: 'MRI',
      name: 'Chụp MRI',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Hình ảnh não',
              description:
                'Không phát hiện tổn thương hoặc bất thường trong cấu trúc não.',
              status: 'Bình thường',
              notes: 'Kích thước não bình thường, không có dấu hiệu phù não.',
              recommendations:
                'Không cần can thiệp, tiếp tục theo dõi sức khỏe định kỳ.',
            },
            {
              name: 'Mạch máu não',
              description:
                'Mạch máu thông suốt, không có dấu hiệu hẹp hoặc phình.',
              status: 'Bình thường',
              notes: 'Tuần hoàn máu trong não ổn định.',
              recommendations: 'Duy trì lối sống lành mạnh, tránh căng thẳng.',
            },
          ],
          notes: 'Hình ảnh MRI không phát hiện bất kỳ bất thường nào.',
          images: [
            'https://example.com/mri_normal1.jpg',
            'https://example.com/mri_normal2.jpg',
          ],
        },
        {
          result: 'Phát hiện bất thường',
          detail: [
            {
              name: 'Hình ảnh não',
              description:
                'Có vùng giảm tín hiệu ở thùy trán trái, kích thước 1.2cm x 1.0cm.',
              status: 'Bất thường',
              notes: 'Có khả năng là tổn thương dạng viêm hoặc u nhỏ.',
              recommendations:
                'Khuyến cáo làm thêm xét nghiệm CT hoặc sinh thiết nếu cần thiết.',
            },
            {
              name: 'Mạch máu não',
              description: 'Tắc nghẽn nhẹ ở động mạch cảnh phải (40%).',
              status: 'Bất thường',
              notes: 'Có dấu hiệu hẹp mạch, có nguy cơ nhồi máu não.',
              recommendations: 'Tham khảo bác sĩ tim mạch để điều trị.',
            },
          ],
          notes: 'Cần theo dõi sát và điều trị kịp thời để tránh biến chứng.',
          images: [
            'https://example.com/mri_abnormal1.jpg',
            'https://example.com/mri_abnormal2.jpg',
          ],
        },
        {
          result: 'Cảnh báo',
          detail: [
            {
              name: 'Tủy sống',
              description:
                'Phát hiện chèn ép tại vùng C4-C5 do thoái hóa đĩa đệm.',
              status: 'Nghiêm trọng',
              notes:
                'Nguy cơ chèn ép dây thần kinh, gây đau nhức và giảm chức năng vận động.',
              recommendations:
                'Cần can thiệp phẫu thuật hoặc vật lý trị liệu ngay lập tức.',
            },
          ],
          notes:
            'Bệnh nhân có triệu chứng nghiêm trọng, yêu cầu can thiệp khẩn cấp.',
          images: ['https://example.com/mri_warning.jpg'],
        },
      ],
    },
    {
      id: 'BloodTest',
      name: 'Xét Nghiệm Máu',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Hemoglobin',
              unit: 'g/dL',
              range: '12.0-16.0',
              value: 14.5,
              status: 'Bình thường',
              notes:
                'Mức hemoglobin trong giới hạn bình thường, đảm bảo đủ oxy trong máu.',
              recommendations:
                'Duy trì chế độ ăn uống giàu chất sắt để ổn định chỉ số.',
            },
            {
              name: 'WBC',
              unit: 'x10^9/L',
              range: '4.0-11.0',
              value: 6.8,
              status: 'Bình thường',
              notes: 'Không có dấu hiệu nhiễm trùng hoặc viêm nhiễm.',
              recommendations:
                'Không cần can thiệp, tiếp tục theo dõi định kỳ.',
            },
            {
              name: 'Glucose',
              unit: 'mmol/L',
              range: '3.9-6.1',
              value: 5.2,
              status: 'Bình thường',
              notes:
                'Chỉ số đường huyết bình thường, không có dấu hiệu tiểu đường.',
              recommendations:
                'Duy trì chế độ ăn uống lành mạnh, hạn chế đồ ngọt.',
            },
          ],
          notes: 'Xét nghiệm máu không phát hiện bất thường.',
          images: ['https://bizweb.dktcdn.net/100/234/598/files/xet-nghiem-cong-thuc-mau.jpg?v=1503202730035'],
        },
        {
          result: 'Bất thường',
          detail: [
            {
              name: 'Hemoglobin',
              unit: 'g/dL',
              range: '12.0-16.0',
              value: 10.8,
              status: 'Thiếu máu',
              notes: 'Chỉ số hemoglobin thấp, có dấu hiệu thiếu máu nhẹ.',
              recommendations:
                'Khuyến cáo bổ sung sắt và kiểm tra nguyên nhân thiếu máu.',
            },
            {
              name: 'WBC',
              unit: 'x10^9/L',
              range: '4.0-11.0',
              value: 12.5,
              status: 'Tăng cao',
              notes: 'Chỉ số bạch cầu tăng cao, có khả năng nhiễm trùng.',
              recommendations:
                'Kiểm tra thêm để xác định nguồn gốc nhiễm trùng.',
            },
          ],
          notes: 'Phát hiện bất thường nhẹ, cần kiểm tra và điều trị kịp thời.',
          images: ['https://bizweb.dktcdn.net/100/234/598/files/xet-nghiem-cong-thuc-mau.jpg?v=1503202730035'],
        },
        {
          result: 'Cảnh báo',
          detail: [
            {
              name: 'Tiểu cầu',
              unit: 'x10^9/L',
              range: '150-450',
              value: 48,
              status: 'Nguy cơ xuất huyết',
              notes:
                'Số lượng tiểu cầu rất thấp, có nguy cơ xuất huyết tự nhiên.',
              recommendations: 'Cần nhập viện và truyền tiểu cầu khẩn cấp.',
            },
          ],
          notes: 'Tình trạng nghiêm trọng, yêu cầu xử lý ngay.',
          images: ['https://bizweb.dktcdn.net/100/234/598/files/xet-nghiem-cong-thuc-mau.jpg?v=1503202730035'],
        },
      ],
    },
    {
      id: 'UrineTest',
      name: 'Xét Nghiệm Nước Tiểu',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Màu sắc',
              description: 'Vàng trong',
              status: 'Bình thường',
            },
            {
              name: 'pH',
              value: 6.0,
              range: '5.0 - 8.0',
              status: 'Bình thường',
            },
            {
              name: 'Protein',
              description: 'Âm tính',
              status: 'Bình thường',
            },
          ],
          notes: 'Không phát hiện bất thường trong nước tiểu.',
          images: ['https://benhviendakhoahongha.vn/wp-content/uploads/2021/10/xet-nghiem-vi-khuan-nhuom-soi-tuoi-dich-am-dao-nam-1.jpg'],
        },
        {
          result: 'Bất thường',
          detail: [
            {
              name: 'Màu sắc',
              description: 'Đỏ hồng',
              status: 'Bất thường',
            },
            {
              name: 'Hồng cầu',
              description: 'Dương tính',
              status: 'Bất thường',
            },
          ],
          notes:
            'Có thể có dấu hiệu nhiễm trùng đường tiết niệu hoặc sỏi thận.',
          images: ['https://benhviendakhoahongha.vn/wp-content/uploads/2021/10/xet-nghiem-vi-khuan-nhuom-soi-tuoi-dich-am-dao-nam-1.jpg'],
        },
        {
          result: 'Cảnh báo',
          detail: [
            {
              name: 'Glucose',
              description: 'Dương tính',
              status: 'Nghiêm trọng',
            },
            {
              name: 'Ketone',
              description: 'Dương tính',
              status: 'Nghiêm trọng',
            },
          ],
          notes:
            'Cần kiểm tra thêm để loại trừ bệnh tiểu đường hoặc các bệnh lý khác.',
          images: ['https://benhviendakhoahongha.vn/wp-content/uploads/2021/10/xet-nghiem-vi-khuan-nhuom-soi-tuoi-dich-am-dao-nam-1.jpg'],
        },
      ],
    },
    {
      id: 'FluidTest',
      name: 'Xét Nghiệm Dịch',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Dịch não tủy',
              description: 'Trong suốt, không màu',
              status: 'Bình thường',
            },
            {
              name: 'Số lượng tế bào',
              value: 5,
              range: '0 - 10',
              status: 'Bình thường',
            },
          ],
          notes: 'Không phát hiện bất thường trong dịch não tủy.',
          images: ['https://benhviendakhoahongha.vn/wp-content/uploads/2021/10/xet-nghiem-vi-khuan-nhuom-soi-tuoi-dich-am-dao-nam-1.jpg'],
        },
        {
          result: 'Bất thường',
          detail: [
            {
              name: 'Dịch khớp gối',
              description: 'Đục, có màu vàng',
              status: 'Bất thường',
            },
            {
              name: 'Vi khuẩn',
              description: 'Dương tính',
              status: 'Bất thường',
            },
          ],
          notes: 'Có thể có dấu hiệu viêm khớp nhiễm trùng.',
          images: ['https://benhviendakhoahongha.vn/wp-content/uploads/2021/10/xet-nghiem-vi-khuan-nhuom-soi-tuoi-dich-am-dao-nam-1.jpg'],
        },
        {
          result: 'Cảnh báo',
          detail: [
            {
              name: 'Dịch màng phổi',
              description: 'Có máu',
              status: 'Nghiêm trọng',
            },
            {
              name: 'Tế bào ung thư',
              description: 'Dương tính',
              status: 'Nghiêm trọng',
            },
          ],
          notes: 'Cần kiểm tra thêm để loại trừ ung thư hoặc các bệnh lý khác.',
          images: ['https://benhviendakhoahongha.vn/wp-content/uploads/2021/10/xet-nghiem-vi-khuan-nhuom-soi-tuoi-dich-am-dao-nam-1.jpg'],
        },
      ],
    },
    {
      id: 'MRA',
      name: 'Chụp MRI Mạch Máu',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Động mạch chủ',
              description: 'Thông suốt, không có dấu hiệu hẹp hoặc phình.',
              status: 'Bình thường',
            },
            {
              name: 'Động mạch cảnh',
              description: 'Thông suốt, không có dấu hiệu hẹp hoặc phình.',
              status: 'Bình thường',
            },
          ],
          notes: 'Hình ảnh MRI mạch máu không phát hiện bất kỳ bất thường nào.',
          images: [
            'https://example.com/mra_normal1.jpg',
            'https://example.com/mra_normal2.jpg',
          ],
        },
        {
          result: 'Phát hiện bất thường',
          detail: [
            {
              name: 'Động mạch vành',
              description: 'Hẹp nhẹ ở động mạch vành trái (30%).',
              status: 'Bất thường',
            },
          ],
          notes: 'Cần theo dõi và điều trị để tránh các biến chứng tim mạch.',
          images: [
            'https://example.com/mra_abnormal1.jpg',
            'https://example.com/mra_abnormal2.jpg',
          ],
        },
        {
          result: 'Cảnh báo',
          detail: [
            {
              name: 'Động mạch chủ bụng',
              description: 'Phình to, có nguy cơ vỡ.',
              status: 'Nghiêm trọng',
            },
          ],
          notes:
            'Cần can thiệp phẫu thuật ngay lập tức để tránh biến chứng nguy hiểm.',
          images: ['https://example.com/mra_warning.jpg'],
        },
      ],
    },
    {
      id: 'BloodSugarTest',
      name: 'Xét Nghiệm Đường Huyết',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Glucose',
              unit: 'mmol/L',
              range: '3.9 - 6.1',
              value: 5.2,
              status: 'Bình thường',
            },
          ],
          notes:
            'Chỉ số đường huyết bình thường, không có dấu hiệu tiểu đường.',
          images: [],
        },
        {
          result: 'Bất thường',
          detail: [
            {
              name: 'Glucose',
              unit: 'mmol/L',
              range: '3.9 - 6.1',
              value: 6.8,
              status: 'Tăng cao',
            },
          ],
          notes:
            'Chỉ số đường huyết tăng cao, có thể là dấu hiệu tiền tiểu đường.',
          images: [],
        },
        {
          result: 'Cảnh báo',
          detail: [
            {
              name: 'Glucose',
              unit: 'mmol/L',
              range: '3.9 - 6.1',
              value: 12.0,
              status: 'Rất cao',
            },
          ],
          notes:
            'Chỉ số đường huyết rất cao, cần kiểm tra thêm để chẩn đoán tiểu đường.',
          images: [],
        },
      ],
    },
    {
      id: 'KidneyFunctionTest',
      name: 'Xét Nghiệm Chức Năng Thận',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Creatinine',
              unit: 'mg/dL',
              range: '0.6 - 1.2',
              value: 0.8,
              status: 'Bình thường',
            },
            {
              name: 'Urea',
              unit: 'mg/dL',
              range: '10 - 50',
              value: 30,
              status: 'Bình thường',
            },
          ],
          notes: 'Chức năng thận hoạt động bình thường.',
          images: [],
        },
        {
          result: 'Bất thường',
          detail: [
            {
              name: 'Creatinine',
              unit: 'mg/dL',
              range: '0.6 - 1.2',
              value: 1.5,
              status: 'Tăng cao',
            },
          ],
          notes: 'Có dấu hiệu suy giảm chức năng thận.',
          images: [],
        },
        {
          result: 'Cảnh báo',
          detail: [
            {
              name: 'Creatinine',
              unit: 'mg/dL',
              range: '0.6 - 1.2',
              value: 3.0,
              status: 'Rất cao',
            },
            {
              name: 'Urea',
              unit: 'mg/dL',
              range: '10 - 50',
              value: 80,
              status: 'Rất cao',
            },
          ],
          notes: 'Suy thận nặng, cần điều trị ngay lập tức.',
          images: [],
        },
      ],
    },
    {
      id: 'GastricUltrasound',
      name: 'Siêu Âm Dạ Dày - Thực Quản',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Dạ dày',
              description: 'Niêm mạc dạ dày bình thường, không có ổ loét.',
              status: 'Bình thường',
            },
            {
              name: 'Thực quản',
              description: 'Thông suốt, không có dấu hiệu trào ngược.',
              status: 'Bình thường',
            },
          ],
          notes: 'Không phát hiện bất thường trong dạ dày và thực quản.',
          images: ['https://example.com/gastric_ultrasound_normal.jpg'],
        },
        {
          result: 'Bất thường',
          detail: [
            {
              name: 'Dạ dày',
              description: 'Viêm loét dạ dày tá tràng.',
              status: 'Bất thường',
            },
          ],
          notes: 'Cần điều trị bằng thuốc và thay đổi chế độ ăn uống.',
          images: ['https://example.com/gastric_ultrasound_abnormal.jpg'],
        },
        {
          result: 'Cảnh báo',
          detail: [
            {
              name: 'Dạ dày',
              description: 'Có khối u nghi ngờ ung thư.',
              status: 'Nghiêm trọng',
            },
          ],
          notes: 'Cần sinh thiết để chẩn đoán xác định.',
          images: ['https://example.com/gastric_ultrasound_warning.jpg'],
        },
      ],
    },
    {
      id: 'CardiacUltrasound',
      name: 'Siêu Âm Tim',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Kích thước tim',
              description: 'Bình thường',
              status: 'Bình thường',
            },
            {
              name: 'Chức năng co bóp',
              description: 'Bình thường',
              status: 'Bình thường',
            },
          ],
          notes: 'Tim hoạt động bình thường.',
          images: ['https://example.com/cardiac_ultrasound_normal.jpg'],
        },
        {
          result: 'Bất thường',
          detail: [
            {
              name: 'Van tim',
              description: 'Hẹp van 2 lá.',
              status: 'Bất thường',
            },
          ],
          notes: 'Cần theo dõi và điều trị để tránh các biến chứng tim mạch.',
          images: ['https://example.com/cardiac_ultrasound_abnormal.jpg'],
        },
        {
          result: 'Cảnh báo',
          detail: [
            {
              name: 'Cơ tim',
              description: 'Suy tim nặng.',
              status: 'Nghiêm trọng',
            },
          ],
          notes: 'Cần điều trị tích cực để cải thiện chức năng tim.',
          images: ['https://example.com/cardiac_ultrasound_warning.jpg'],
        },
      ],
    },
    {
      id: 'ThyroidUltrasound',
      name: 'Siêu Âm Tuyến Giáp',
      testResults: [
        {
          result: 'Bình thường',
          detail: [
            {
              name: 'Kích thước tuyến giáp',
              description: 'Bình thường',
              status: 'Bình thường',
            },
            {
              name: 'Cấu trúc tuyến giáp',
              description: 'Đồng nhất, không có nhân hoặc nang.',
              status: 'Bình thường',
            },
          ],
          notes: 'Tuyến giáp hoạt động bình thường.',
          images: ['https://example.com/thyroid_ultrasound_normal.jpg'],
        },
        {
          result: 'Bất thường',
          detail: [
            {
              name: 'Tuyến giáp',
              description: 'Có nhân tuyến giáp nhỏ.',
              status: 'Bất thường',
            },
          ],
          notes:
            'Cần theo dõi và kiểm tra thêm để đánh giá tính chất của nhân.',
          images: ['https://example.com/thyroid_ultrasound_abnormal.jpg'],
        },
        {
          result: 'Cảnh báo',
          detail: [
            {
              name: 'Tuyến giáp',
              description: 'Có khối u nghi ngờ ung thư.',
              status: 'Nghiêm trọng',
            },
          ],
          notes: 'Cần sinh thiết để chẩn đoán xác định.',
          images: ['https://example.com/thyroid_ultrasound_warning.jpg'],
        },
      ],
    },
  ],
};
