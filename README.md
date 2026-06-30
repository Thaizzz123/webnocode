# PharmDoc — Cấu trúc dự án

```text
PharmDoc/
├── index.html
│   Giao diện chính của website, gồm Home, Search, Header, Footer và Modal hiển thị chi tiết thuốc.
│
├── css/
│   └── style.css
│      Toàn bộ giao diện được thiết kế tại đây: màu sắc, bố cục, hiệu ứng chuyển động, badge, scrollbar...
│
└── js/
    ├── config.js
    │   Chứa các hằng số của hệ thống (APP_CONFIG) và trạng thái hiện tại của ứng dụng (state).
    │
    ├── data.js
    │   Cơ sở dữ liệu gồm khoảng 300 loại thuốc, kèm thông tin phân loại OTC/Rx,
    │   nhóm điều trị, triệu chứng hỗ trợ và độ phổ biến.
    │
    ├── symptom-engine.js
    │   "Bộ não" của PharmDoc.
    │   Tự xây dựng thuật toán gợi ý thuốc dựa trên triệu chứng người dùng nhập,
    │   hoàn toàn không sử dụng API hay AI bên ngoài.
    │
    ├── render.js
    │   Chịu trách nhiệm hiển thị dữ liệu lên giao diện:
    │   danh sách thuốc, trang kết quả, modal chi tiết và điều hướng giữa các trang.
    │
    ├── interactions.js
    │   Xử lý toàn bộ tương tác của người dùng như:
    │   tìm kiếm, bộ lọc, chatbot, toast thông báo, Dark Mode và Disclaimer.
    │
    └── app-init.js
        Điểm khởi động của ứng dụng.
        Khởi tạo dữ liệu và kết nối toàn bộ các module khi website được tải.
```

## Vai trò của từng thành phần

### data.js

Đây là nơi lưu toàn bộ dữ liệu thuốc của hệ thống. Mỗi thuốc đều có đầy đủ thông tin như tên, nhóm điều trị, loại thuốc (OTC hoặc Rx), triệu chứng phù hợp và độ phổ biến để phục vụ việc tìm kiếm cũng như gợi ý.

### symptom-engine.js

Đây là thành phần quan trọng nhất của dự án.

Thay vì chỉ tìm kiếm theo từ khóa, PharmDoc sử dụng thuật toán tự xây dựng để lựa chọn những thuốc phù hợp nhất với các triệu chứng mà người dùng nhập.

Thuật toán hoạt động theo nguyên tắc:

* Ưu tiên thuốc điều trị được nhiều triệu chứng cùng lúc.
* Nếu nhiều thuốc có hiệu quả tương đương, ưu tiên thuốc phổ biến hơn.
* Nếu vẫn còn bằng nhau, ưu tiên thuốc không kê đơn (OTC) trước thuốc kê đơn (Rx).
* Tiếp tục lặp lại quá trình cho đến khi tất cả triệu chứng được bao phủ hoặc không còn thuốc phù hợp.

Nhờ đó, kết quả gợi ý vừa hợp lý, vừa dễ hiểu và không phụ thuộc vào bất kỳ dịch vụ AI hay API bên ngoài nào.

### render.js và interactions.js

Hai module này đảm nhiệm toàn bộ phần trải nghiệm người dùng.

* Hiển thị danh sách thuốc.
* Điều hướng giữa các trang.
* Hiển thị thông tin chi tiết.
* Tìm kiếm theo từ khóa.
* Lọc dữ liệu.
* Chatbot hỗ trợ.
* Toast thông báo.
* Dark Mode.
* Disclaimer.

Đây cũng là phần dễ quan sát nhất khi trình diễn sản phẩm.

### config.js và app-init.js

Hai module này đóng vai trò nền tảng của hệ thống.

* `config.js` quản lý các cấu hình và trạng thái chung của ứng dụng.
* `app-init.js` khởi tạo hệ thống, kết nối các module và đảm bảo website hoạt động ngay sau khi tải xong.
