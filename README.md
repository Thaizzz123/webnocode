# PharmDoc — Cấu trúc dự án 

```
PharmDoc/
├── index.html              # Khung giao diện: modal, header, trang Home, trang Search, footer
├── css/
│   └── style.css            # Toàn bộ CSS tuỳ chỉnh (badge, animation, scrollbar...)
└── js/
    ├── config.js             # APP\_CONFIG (hằng số) + state (trạng thái UI hiện tại)
    ├── data.js                # Cơ sở dữ liệu 300 loại thuốc + bảng độ phổ biến
    ├── symptom-engine.js      # Engine gợi ý thuốc theo triệu chứng (tự xây, không gọi API ngoài)
    ├── render.js               # Routing trang, lọc dữ liệu, render thẻ thuốc, modal chi tiết
    ├── interactions.js          # Tìm kiếm, filter, chat, toast, dark mode, disclaimer
    └── app-init.js               # Điểm khởi chạy khi trang load xong
```

## Dùng cho thế nào 

* **data.js** — cho thấy quy mô dữ liệu (300 thuốc, có phân loại OTC/Rx, tag triệu chứng).
* **symptom-engine.js** — phần lõi kỹ thuật, đáng nói nhất: thuật toán `recommend Medicines` chọn thuốc theo nguyên tắc phủ nhiều triệu chứng nhất, ưu tiên độ phổ biến, rồi ưu tiên OTC trước Rx, lặp lại đến khi hết triệu chứng hoặc hết thuốc phù hợp.
* **render.js / interactions.js** — phần giao diện, dễ demo trực quan trên màn hình khi đang thuyết trình.
* **config.js / app-init.js** — phần khởi tạo, giải thích nhanh trong 1-2 câu là đủ.

