import './Introduction.css';
import { Flex } from 'antd';
import nhatho from './assets/nhatho.jpg';

function Introduction() {
    return (
        <div className="introduction-container">
            {/* Back button */}
            {/* <Link to="/" className="back-button">
                Trở về
            </Link> */}

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
                        <span>Cây có cội mới nảy mầm xanh lá</span>
                        <span>Nước có nguồn mới biển rộng sông sâu.</span>
                        <span>Con người nguồn cội từ đâu</span>
                        <span>Có ông bà cha mẹ rồi sau mới có mình</span>
                    </Flex>
                    <p>
                        Cũng chính vì thế nên từ xưa nhiều dòng họ đã lập nên
                        gia phả, mục đích để con cháu đời sau biết được nguồn
                        gốc lai lịch, thân thế và sự nghiệp các tổ tiên dòng
                        tộc. Theo dòng chảy của thời gian, họ Trần chúng ta cùng
                        trải qua bao nỗi thăng trầm trong những cuộc kháng chiến
                        đầy gian nan và khốc liệt, đã có không ít người phải hy
                        sinh tính mạng, của cải, xương máu để có được ngày hòa
                        bình hôm nay. Sau chiến tranh, con cháu đã tìm được bút
                        tích của ông Cử Nhân Trần Thường để lại nhờ ông Trần Hóa
                        (cháu nội ông Trần Thường) đã dày công sưu tầm và biên
                        soạn thành cuốn gia phả.
                    </p>

                    <p>
                        Các đời họ Trần qua bút tích của ông Trần Thường cho
                        chúng ta biết được một phần lịch sử của dòng họ Trần từ
                        đời ông thủy tổ Trần Thái Lộc, đến đời cử nhân Trần
                        Thường là 7 đời, biết được dòng họ ta xưa kia đã cư trú
                        lâu đời ở Phổ Phong, Đức Phổ và Ba Động, Ba Tơ.
                    </p>

                    <p>
                        Ông bà ta tuy nghèo nhưng sống có đạo lý, hiếu nghĩa cần
                        kiệm, chăm chỉ tự khai khẩn đất đai làm ăn sinh sống để
                        lại cho con cháu sau này, lương hiếu kính với tổ tiên,
                        ông bà cha mẹ, không quên công ơn các bậc sinh thành đã
                        mất, cùng nhau quyên góp tiền của để cúng giỗ ông bà
                        trong các ngày đầu xuân và đông chí hàng năm. Phát huy
                        truyền thống uống nước nhớ nguồn, ăn quả nhớ người trông
                        cây.
                    </p>

                    <p>
                        Nay có ông Trần Trung Triết (cháu cố ông cử Trần
                        Thường), đã đứng ra kêu gọi con cháu họ Trần nội ngoại
                        gần xa đóng góp tiền của, kẻ ít người nhiều để xây dựng
                        nhà thờ họ. Nhờ hồng phúc ông bà phù hộ, con cháu đã xây
                        dựng được: Nhà thờ họ Trần, chi nhánh Vĩnh Xuân, Phổ
                        Phong – Hóc Kè, Ba Động. Thật là khang trang tọa lạc,
                        tại khu vườn của ông Trần Trung Triết. Đây là mơ ước của
                        bao đời ông cha, nay con cháu đã thực hiện được.
                    </p>

                    {/* Insert hình */}
                    <div className="introduction-image">
                        <img src={nhatho} alt="Nhà thờ họ Trần" />
                    </div>

                    <p>
                        Đây là nơi để con cháu họ Trần nội ngoại gần xa tề tựu
                        về để dâng lên tổ tiên ông bà cây hương chén nước, để tỏ
                        lòng thành kính tri ân trong những dịp tết đến xuân về
                        và các ngày cúng giỗ hàng năm.
                    </p>

                    <p>
                        Ngày nay nhờ công nghệ phát triển việc lưu giữ gia phả
                        và kết nối con cháu gần xa cũng được dễ dàng hơn.
                    </p>

                    <p>
                        Qua trang web GIA PHẢ HỌ TRẦN với mong muốn kế thừa
                        những giá trị truyền thống từ cuốn{' '}
                        <i>Trần Thị Thế Phổ</i> của ông cử nhân Trần Thường.
                    </p>

                    <p>
                        Nhằm mở ra một không gian kết nối trực tuyến giúp chúng
                        ta dễ dàng tra cứu thông tin về nguồn gốc tổ tiên, về
                        quan hệ huyết thống và cùng nhau chia sẻ bổ sung ý kiến
                        làm phong phú thêm di sản của dòng họ.
                    </p>

                    <p>
                        Mỗi lần xem là chúng ta lại thấy dòng chảy ký ức lại
                        tràn về, những tấm gương nhân đức, hiếu nghĩa, hiếu học,
                        nhân ái, cần kiệm của tổ tiên ông bà lại hiện về. Càng
                        tự hào bao nhiêu thì chúng ta càng thấy rõ trách nhiệm
                        bản thân, phải sống sao cho xứng đáng với truyền thống
                        của dòng họ. Đó cũng là cách tốt nhất để tri ân đến tổ
                        tiên và góp phần làm rạng danh dòng tộc.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Introduction;
