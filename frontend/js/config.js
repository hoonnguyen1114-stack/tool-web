// API Configuration
const API_BASE_URL = window.location.origin;
const API_ENDPOINTS = {
  basic: `${API_BASE_URL}/api/variants/basic`,
  advanced: `${API_BASE_URL}/api/variants/advanced`,
  custom: `${API_BASE_URL}/api/variants/custom`
};

// Rules Configuration
const RULES_CONFIG = [
  {
    id: 1,
    name: "📝 Viết thường/hoa/Capitalize",
    rules: [
      { id: "1a", label: "Viết thường (lowercase)" },
      { id: "1b", label: "Viết hoa (UPPERCASE)" },
      { id: "1c", label: "Hoa đầu tiên (Capitalize)" }
    ]
  },
  {
    id: 2,
    name: "🔢 Thêm số phổ biến",
    rules: [
      { id: "2a", label: "+123" },
      { id: "2b", label: "+1234" },
      { id: "2c", label: "+12345" },
      { id: "2d", label: "+123456" },
      { id: "2e", label: "+1234567" },
      { id: "2f", label: "+12345678" },
      { id: "2g", label: "+123456789" }
    ]
  },
  {
    id: 3,
    name: "📅 Thêm năm phổ biến",
    rules: [
      { id: "3a", label: "+1990" },
      { id: "3b", label: "+2000" },
      { id: "3c", label: "+2010" },
      { id: "3d", label: "+2020" },
      { id: "3e", label: "+2024" },
      { id: "3f", label: "+90" },
      { id: "3g", label: "+95" }
    ]
  },
  {
    id: 4,
    name: "🔣 Thêm ký tự đặc biệt",
    rules: [
      { id: "4a", label: "+@" },
      { id: "4b", label: "+@@" },
      { id: "4c", label: "+!" },
      { id: "4d", label: "+!!" },
      { id: "4e", label: "+#" },
      { id: "4f", label: "+$" }
    ]
  },
  {
    id: 5,
    name: "🎯 Hậu tố kiểu Việt",
    rules: [
      { id: "5a", label: "+vip" },
      { id: "5b", label: "+pro" },
      { id: "5c", label: "+cute" },
      { id: "5d", label: "+love" },
      { id: "5e", label: "+baby" },
      { id: "5f", label: "+hihi" },
      { id: "5g", label: "+kaka" }
    ]
  },
  {
    id: 6,
    name: "💠 Chuyển sang LEET speak",
    rules: [
      { id: "6a", label: "a→@" },
      { id: "6b", label: "o→0" },
      { id: "6c", label: "i→1" },
      { id: "6d", label: "e→3" },
      { id: "6e", label: "s→$" },
      { id: "6f", label: "t→7" }
    ]
  },
  {
    id: 7,
    name: "➖ Thêm dấu phân cách",
    rules: [
      { id: "7a", label: "chèn _" },
      { id: "7b", label: "chèn -" },
      { id: "7c", label: "chèn ." }
    ]
  },
  {
    id: 8,
    name: "🔄 Đảo ngược",
    rules: [
      { id: "8a", label: "Reverse toàn bộ" },
      { id: "8b", label: "Reverse chữ, giữ số" }
    ]
  },
  {
    id: 9,
    name: "📦 Nhân đôi & Lặp lại",
    rules: [
      { id: "9a", label: "Double (xxx→xxxxx)" },
      { id: "9b", label: "+Pass 2x" }
    ]
  },
  {
    id: 10,
    name: "👤 Từ Username",
    rules: [
      { id: "10a", label: "User+123" },
      { id: "10b", label: "User+@" },
      { id: "10c", label: "User+1999" },
      { id: "10d", label: "User@123" }
    ]
  },
  {
    id: 11,
    name: "🔗 Ghép & Biến đổi",
    rules: [
      { id: "11a", label: "Thêm số cuối (111→1111)" },
      { id: "11b", label: "Thêm số đầu (111→1111)" },
      { id: "11c", label: "CamelCase (hello→Hello)" }
    ]
  },
  {
    id: 12,
    name: "☎️ Biến đổi số điện thoại",
    rules: [
      { id: "12a", label: "SĐT+@" },
      { id: "12b", label: "SĐT+123" },
      { id: "12c", label: "SĐT+vip" }
    ]
  }
];
