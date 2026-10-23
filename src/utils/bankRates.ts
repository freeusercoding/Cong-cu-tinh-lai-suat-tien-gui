import { BankRateInfo } from '../types/deposit';

export const POPULAR_VIETNAMESE_BANKS: BankRateInfo[] = [
  {
    code: 'VCB',
    name: 'Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)',
    shortName: 'Vietcombank',
    logoText: 'VCB',
    color: '#005b26',
    rates: {
      '1': 2.0,
      '2': 2.0,
      '3': 2.3,
      '6': 3.3,
      '9': 3.3,
      '12': 4.7,
      '18': 4.7,
      '24': 4.7,
      '36': 4.7,
    }
  },
  {
    code: 'BIDV',
    name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
    shortName: 'BIDV',
    logoText: 'BIDV',
    color: '#0d4c8b',
    rates: {
      '1': 2.0,
      '2': 2.0,
      '3': 2.3,
      '6': 3.3,
      '9': 3.3,
      '12': 4.8,
      '18': 4.8,
      '24': 4.9,
      '36': 4.9,
    }
  },
  {
    code: 'CTG',
    name: 'Ngân hàng TMCP Công Thương Việt Nam (VietinBank)',
    shortName: 'VietinBank',
    logoText: 'CTG',
    color: '#005ba4',
    rates: {
      '1': 2.0,
      '2': 2.0,
      '3': 2.3,
      '6': 3.3,
      '9': 3.3,
      '12': 4.8,
      '18': 4.8,
      '24': 5.0,
      '36': 5.0,
    }
  },
  {
    code: 'AGR',
    name: 'Ngân hàng Nông nghiệp và PTNT (Agribank)',
    shortName: 'Agribank',
    logoText: 'AGR',
    color: '#8b1e22',
    rates: {
      '1': 2.2,
      '2': 2.2,
      '3': 2.5,
      '6': 3.5,
      '9': 3.5,
      '12': 4.8,
      '18': 4.8,
      '24': 4.8,
      '36': 4.8,
    }
  },
  {
    code: 'TCB',
    name: 'Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)',
    shortName: 'Techcombank',
    logoText: 'TCB',
    color: '#d41224',
    rates: {
      '1': 3.2,
      '2': 3.2,
      '3': 3.4,
      '6': 4.5,
      '9': 4.5,
      '12': 5.1,
      '18': 5.1,
      '24': 5.1,
      '36': 5.1,
    }
  },
  {
    code: 'MBB',
    name: 'Ngân hàng TMCP Quân Đội (MB Bank)',
    shortName: 'MBBank',
    logoText: 'MB',
    color: '#002663',
    rates: {
      '1': 3.5,
      '2': 3.6,
      '3': 3.9,
      '6': 4.5,
      '9': 4.6,
      '12': 5.3,
      '18': 5.5,
      '24': 5.7,
      '36': 5.8,
    }
  },
  {
    code: 'VPB',
    name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)',
    shortName: 'VPBank',
    logoText: 'VPB',
    color: '#008542',
    rates: {
      '1': 3.6,
      '2': 3.6,
      '3': 3.8,
      '6': 4.8,
      '9': 4.8,
      '12': 5.4,
      '18': 5.4,
      '24': 5.6,
      '36': 5.6,
    }
  },
  {
    code: 'ACB',
    name: 'Ngân hàng TMCP Á Châu (ACB)',
    shortName: 'ACB',
    logoText: 'ACB',
    color: '#0054a6',
    rates: {
      '1': 3.1,
      '2': 3.3,
      '3': 3.5,
      '6': 4.4,
      '9': 4.4,
      '12': 5.0,
      '18': 5.1,
      '24': 5.1,
      '36': 5.1,
    }
  },
  {
    code: 'HDB',
    name: 'Ngân hàng TMCP Phát triển TP.HCM (HDBank)',
    shortName: 'HDBank',
    logoText: 'HDB',
    color: '#e30613',
    rates: {
      '1': 3.5,
      '2': 3.5,
      '3': 3.6,
      '6': 5.2,
      '9': 5.0,
      '12': 5.7,
      '18': 6.0,
      '24': 5.9,
      '36': 5.8,
    }
  },
  {
    code: 'VIB',
    name: 'Ngân hàng Quốc Tế (VIB)',
    shortName: 'VIB',
    logoText: 'VIB',
    color: '#005a9c',
    rates: {
      '1': 3.5,
      '2': 3.5,
      '3': 3.8,
      '6': 4.7,
      '9': 4.7,
      '12': 5.3,
      '18': 5.3,
      '24': 5.5,
      '36': 5.5,
    }
  }
];

export const SBV_REGULATIONS = {
  // Trần lãi suất theo quy định của Ngân hàng Nhà nước Việt Nam
  demandDepositCeiling: 0.5, // Tiền gửi không kỳ hạn và kỳ hạn dưới 1 tháng: tối đa 0.5%/năm
  under6MonthsCeiling: 4.75, // Tiền gửi từ 1 tháng đến dưới 6 tháng: tối đa 4.75%/năm
  minimumStandardDeposit: 1_000_000, // Mức tối thiểu thông thường 1.000.000 VND
};
