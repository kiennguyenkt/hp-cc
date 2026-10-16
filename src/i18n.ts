import type { Locale } from './domain/types';

const vi = {
  appTitle: 'Tính HP sự kiện', eyebrow: 'Bộ dự báo tài nguyên', config: 'Cấu hình', addConfig: 'Nhân bản cấu hình',
  saved: 'Đã lưu trên trình duyệt', saving: 'Đang lưu…', saveError: 'Không thể lưu', language: 'Ngôn ngữ',
  parameters: 'Tham số', collapse: 'Thu gọn', expand: 'Mở tham số', endDate: 'Ngày kết thúc', endsAt: 'Kết thúc lúc 08:00',
  timeLeft: 'Thời gian còn lại', days: 'ngày', hours: 'giờ', currentGuildLevel: 'Level bang hiện tại', maxGuildLevel: 'Level bang tối đa',
  hpRecoveryRate: 'Hồi HP / phút', extraBottlesAtMax: 'Bình thêm khi bang max', otherRules: 'Quy tắc nguồn bình', bottleRate: '1 bình = 500 HP',
  package249: 'Nạp gói 249', dailyDiamonds: 'Mua đủ 5 lượt Daily bằng KC', dailyHint: 'Daily: 60 quảng cáo + 90 × 5 bình/ngày',
  packageHint: 'Gói 249: 200 trả phí + 10 free/ngày', accountData: 'Dữ liệu account', currentMerit: 'Chiến công hiện có',
  maxHpReset: 'Max HP reset / ngày', currentHp: 'Máu hiện tại', hpBackup: 'HP dự trữ', currentBottles: 'Số bình hiện tại',
  recoveryLimit: 'Giới hạn dự trữ HP', projectedTitle: 'Dự kiến đến cuối event', currentLevel: 'Level hiện tại', guildMax: 'Bang max level',
  fillTime: 'Hồi đầy dự trữ', dischargeTime: 'Thời gian cần xả', dischargeHp: 'HP cần xả', targets: 'Các mốc mục tiêu',
  target: 'Mốc', missingHp: 'HP thiếu', missingBottles: 'Bình thiếu', details: 'Chi tiết tính toán', hpRecovered: 'HP hồi đến ngày kết thúc',
  hpReset: 'HP reset', bottlesToEnd: 'Tổng bình đến end', bottleHp: 'Tổng HP từ bình', comparisons: 'So sánh kịch bản',
  both: 'Bật cả hai', noPackage: 'Không nạp gói 249', noDaily: 'Không mua Daily bằng KC', neither: 'Tắt cả hai',
  currentScenario: 'Đang áp dụng', snapshotTip: 'Số bình hiện tại là snapshot đã gồm mọi nguồn từng nhận. Dự báo chỉ cộng phần tương lai.',
  maxTip: 'Bang max chỉ cộng chênh lệch thưởng từ level hiện tại, không cộng lại phần đã nhận.',
  backupAdjustedTitle: 'Đã điều chỉnh HP dự trữ', backupAdjustedBody: 'HP dự trữ không thể lớn hơn giới hạn. Giá trị đã được đưa về đúng giới hạn.',
  close: 'Đã hiểu', invalid: '—', bottles: 'bình', hp: 'HP', selected: 'đang chọn', inputHint: 'Nhập số không âm',
} as const;

const en: Record<keyof typeof vi, string> = {
  appTitle: 'Event HP Calculator', eyebrow: 'Resource projection', config: 'Config', addConfig: 'Duplicate config',
  saved: 'Saved in this browser', saving: 'Saving…', saveError: 'Unable to save', language: 'Language',
  parameters: 'Parameters', collapse: 'Collapse', expand: 'Show parameters', endDate: 'End date', endsAt: 'Ends at 08:00',
  timeLeft: 'Time remaining', days: 'days', hours: 'hours', currentGuildLevel: 'Current guild level', maxGuildLevel: 'Maximum guild level',
  hpRecoveryRate: 'HP recovery / minute', extraBottlesAtMax: 'Extra bottles at max level', otherRules: 'Bottle sources', bottleRate: '1 bottle = 500 HP',
  package249: 'Purchase package 249', dailyDiamonds: 'Buy all 5 Diamond Daily offers', dailyHint: 'Daily: 60 ads + 90 × 5 bottles/day',
  packageHint: 'Package 249: 200 paid + 10 free/day', accountData: 'Account data', currentMerit: 'Current Merit',
  maxHpReset: 'Max HP reset / day', currentHp: 'Current HP', hpBackup: 'HP backup', currentBottles: 'Current bottles',
  recoveryLimit: 'HP recovery limit', projectedTitle: 'Projected at event end', currentLevel: 'Current level', guildMax: 'Guild max level',
  fillTime: 'Time to fill reserve', dischargeTime: 'Time to discharge', dischargeHp: 'HP to discharge', targets: 'Target milestones',
  target: 'Target', missingHp: 'HP missing', missingBottles: 'Bottles missing', details: 'Calculation details', hpRecovered: 'HP recovered by event end',
  hpReset: 'HP reset', bottlesToEnd: 'Total bottles at end', bottleHp: 'Total HP from bottles', comparisons: 'Scenario comparison',
  both: 'Both enabled', noPackage: 'No package 249', noDaily: 'No Diamond Daily', neither: 'Both disabled',
  currentScenario: 'In use', snapshotTip: 'Current bottles are a snapshot containing all sources already received. The projection only adds future sources.',
  maxTip: 'Guild max only adds the reward difference from the current level; received rewards are not counted twice.',
  backupAdjustedTitle: 'HP backup adjusted', backupAdjustedBody: 'HP backup cannot exceed its limit. The value was reduced to match the limit.',
  close: 'Got it', invalid: '—', bottles: 'bottles', hp: 'HP', selected: 'selected', inputHint: 'Enter a non-negative number',
};

export type TranslationKey = keyof typeof vi;
export const messages = { vi, en } as const;
export function translator(locale: Locale) { return (key: TranslationKey) => messages[locale][key]; }
