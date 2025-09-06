import React from 'react';
import { Link } from 'react-router-dom';
import './Introduction.css';
import { Flex } from 'antd';

function Introduction() {
    return (
        <div className="introduction-container">
            {/* Back button */}
            <Link to="/" className="back-button">
                Trở về
            </Link>

            <div className="introduction-header">
                <h1 className="introduction-title">Lời mở đầu</h1>
                <p className="introduction-subtitle">Trần Thị Thế Phổ</p>
            </div>

            <div className="introduction-content-wrapper">
                <div className="introduction-content">
                    <Flex
                        vertical
                        align="center"
                        justify="center"
                        gap={4}
                        style={{ marginBottom: '16px' }}
                    >
                        <span>Con người có tổ có tông,</span>
                        <span>Như cây có cội, như sông có nguồn.</span>
                    </Flex>
                    <p>
                        Đó là đạo lý ngàn đời của dân tộc ta, nhắc nhở mỗi người
                        luôn hướng về cội nguồn, tưởng nhớ công đức tổ tiên. Gia
                        phả vì thế trở thành một phần thiêng liêng của mỗi dòng
                        họ, là nơi lưu giữ ký ức, tông tích, đồng thời cũng là
                        ngọn đèn soi đường cho thế hệ mai sau biết trân trọng,
                        tự hào và gìn giữ truyền thống.
                    </p>
                    <p>
                        Họ Trần chúng ta vốn có lịch sử lâu đời, trải qua bao
                        biến thiên của thời cuộc, từ buổi khai cơ lập nghiệp cho
                        đến khi con cháu ngày càng đông đúc, phân tán khắp mọi
                        miền. Dù ở nơi đâu, làm bất cứ nghề gì, chúng ta vẫn
                        luôn cùng chung một huyết thống, một gốc tổ tiên. Việc
                        biên soạn, gìn giữ và truyền lại gia phả không chỉ là
                        bổn phận đối với tiền nhân, mà còn là cách để con cháu
                        khẳng định tinh thần “uống nước nhớ nguồn, ăn quả nhớ kẻ
                        trồng cây”, đồng thời bồi đắp thêm tình đoàn kết, gắn bó
                        trong dòng họ.
                    </p>
                    <p>
                        Cuốn gia phả họ Trần xưa kia được cụ Trần Thường dày
                        công chép lại, lấy tên là “Trần Thị Thế Phổ”, đánh dấu
                        mốc quan trọng khi những tư liệu truyền miệng của tổ
                        tiên được hệ thống hóa thành văn bản. Về sau, cuốn gia
                        phả ấy lại được cụ Trần Hóa (Bốn Hóa) tiếp tục sưu tầm,
                        biên dịch và bổ sung thêm nhiều chi tiết quý báu. Công
                        lao của các bậc tiền nhân trong việc lưu giữ gia phả là
                        vô cùng to lớn, để lại cho con cháu chúng ta một di sản
                        tinh thần đáng trân trọng và gìn giữ.
                    </p>
                    <p>
                        Ngày nay, trong thời đại công nghệ, việc bảo tồn và phát
                        huy gia phả đã có thêm những phương thức mới mẻ và thuận
                        tiện. Chính vì vậy, trang web Gia phả họ Trần được ra
                        đời với mong muốn kế thừa những giá trị truyền thống từ
                        cuốn “Trần Thị Thế Phổ”, đồng thời mở ra một không gian
                        kết nối trực tuyến cho con cháu họ Trần ở khắp mọi miền.
                        Đây sẽ là nơi lưu giữ và tra cứu thông tin về tông tích
                        tổ tiên, ghi lại những đóng góp của các thế hệ, cũng như
                        là cầu nối để mỗi người con họ Trần có thể bổ sung, chia
                        sẻ và cùng nhau làm phong phú thêm di sản chung.
                    </p>
                    <p>
                        Gia phả không chỉ là tập hợp những trang ghi chép khô
                        khan về tên tuổi, thế hệ, mà còn là dòng chảy ký ức –
                        nơi phản chiếu tinh thần hiếu nghĩa, nhân ái, cần cù và
                        hiếu học của dòng tộc. Mỗi khi mở lại gia phả, con cháu
                        hôm nay thêm phần tự hào và càng thấy rõ trách nhiệm
                        sống xứng đáng với truyền thống ấy. Đó chính là cách tốt
                        nhất để tri ân tổ tiên và làm rạng danh họ Trần.
                    </p>
                    <p>
                        Xin kính cẩn tưởng nhớ công đức của tổ tiên, ghi nhận
                        công lao của các bậc tiền nhân như cụ Trần Thường và cụ
                        Trần Hóa đã dày công chép lại, sưu tầm và bổ sung gia
                        phả. Nguyện cầu cho con cháu họ Trần muôn đời đoàn kết,
                        hiếu nghĩa, hưng thịnh và rạng danh.
                    </p>
                </div>

                {/* <div className="navigation-buttons">
                    <Link className="home-menu" to="/">
                        Trang chủ
                    </Link>
                    <Link className="home-menu" to="/family-4gen">
                        Xem gia phả
                    </Link>
                </div> */}
            </div>
        </div>
    );
}

export default Introduction;
