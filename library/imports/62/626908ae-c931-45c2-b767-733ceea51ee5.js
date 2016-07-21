var ArchivementName = [{ name: 'bai khong nan',
    des: 'Nhà hiền triết'
}, { name: 'Bạn là triệu phú', des: "Trả lời đúng hết 15 câu hỏi. Bạn chính là Triệu Phú mà chúng tôi tìm kiếm lâu nay."
}, { name: 'bat kha chien bai', des: 'Nhà hiền triết'
}, { name: 'Bắt nhịp chiến thắng', des: "Cần 5 chiến thắng để mở danh hiệu này. Tập trung và bạn sẽ làm được."
}, { name: 'Bứt tốc vượt lên', des: "Vượt qua mốc 10 câu hỏi của chương trình. Bạn bắt nhịp rất nhanh."
}, { name: 'Chạm tay chiến thắng', des: "Dừng bước khi chỉ còn cách chiến thắng 1 câu thật không vui vẻ gì nhưng đây là cách duy nhất để nhận danh hiệu này."
}, { name: 'Chiến thắng mở hàng', des: "Lần đầu tiên luôn thú vị, nhất là khi chiến thắng. Danh hiệu này để ghi nhận chiến thắng đầu tiên của bạn."
}, { name: 'dai kien tuong', des: 'Nhà hiền triết'
}, { name: 'doc co cau bai', des: 'Nhà hiền triết'
}, { name: 'everest', des: 'Nhà hiền triết'
}, { name: 'fansipan', des: 'Nhà hiền triết'
}, { name: 'hat trick', des: 'Nhà hiền triết'
}, { name: 'huyen thoai', des: 'Nhà hiền triết'
}, { name: 'keo ngot', des: 'Nhà hiền triết'
}, { name: 'Khởi đầu mạnh mẽ', des: "Vượt qua mốc 5 câu hỏi của chương trình. Nghe vậy chứ không dễ đâu."
}, { name: 'khoi dong thanh cong', des: 'Nhà hiền triết'
}, { name: 'kho bau kien thuc', des: 'Nhà hiền triết'
}, { name: 'kien tuong', des: 'Nhà hiền triết'
}, { name: 'ky phung dich thu', des: 'Nhà hiền triết'
}, { name: 'Nhà hiền triết', des: "Người có học vấn, có hiểu biết sâu rộng, được người đời tôn sùng."
}, { name: 'olympus', des: 'Nhà hiền triết'
}, { name: 'Thần rùa', des: "Rùa khởi đầu chậm nhưng quan trọng là vẫn giành được chiến thắng với 1 câu trả lời đúng."
}, { name: 'than toc tao bao', des: 'Nhà hiền triết'
}, { name: 'thap toan thap my', des: 'Nhà hiền triết'
}, { name: 'tho san chien thang', des: 'Nhà hiền triết'
}, { name: 'vua cam hoa', des: 'Nhà hiền triết'
}, { name: 'Yêu hòa bình', des: "Hòa 20 trận thách đấu. Bạn có thể mang lại hòa bình cho thế giới."
}];
var State = require('State');
var ArchivementKey = ['BAIKHONGNAN', 'BANLATRIEUPHU', 'BATKHACHIENBAI', 'BATNHIPCHIENTHANG', 'BUCTOCVUOTLEN', 'CHAMTAYCHIENTHANG', 'CHIENTHANGMOHANG', 'DAIKIENTUONG', 'DOCCOCAUBAI', 'EVEREST', 'FANSIPAN', 'HATTRICK', 'HUYENTHOAI', 'ITEMDEFAULT', 'KEONGOT', 'KHOIDAUMANHME', 'KHOIDONGTHANHCONG', 'KHOBAUKIENTHUC', 'KIENTUONG', 'KYPHUNGDICHTHU', 'NHAHIENTRIET', 'OLYMPUS', 'THANRUA', 'THANTOCTAOBAO', 'THAPTOANTHAPMY', 'THOSANCHIENTHANG', 'VUACAMHOA', 'YEUHOABINH'];
var ArchivementNumber = cc.Enum({
    BAIKHONGNAN: 0,
    BANLATRIEUPHU: 1,
    BATKHACHIENBAI: 2,
    BATNHIPCHIENTHANG: 3,
    BUCTOCVUOTLEN: 4,
    CHAMTAYCHIENTHANG: 5,
    CHIENTHANGMOHANG: 6,
    DAIKIENTUONG: 7,
    DOCCOCAUBAI: 8,
    EVEREST: 9,
    FANSIPAN: 10,
    HATTRICK: 11,
    HUYENTHOAI: 12,
    KEONGOT: 13,
    KHOIDAUMANHME: 14,
    KHOIDONGTHANHCONG: 15,
    KHOBAUKIENTHUC: 16,
    KIENTUONG: 17,
    KYPHUNGDICHTHU: 18,
    NHAHIENTRIET: 19,
    OLYMPUS: 20,
    THANRUA: 21,
    THANTOCTAOBAO: 22,
    THAPTOANTHAPMY: 23,
    THOSANCHIENTHANG: 24,
    VUACAMHOA: 25,
    YEUHOABINH: 26,
    DEFAULT: 27
});
//resources/textures/archivement/
var ArchivementPath = ['atp__achievement_bai_khong_nan.png', 'atp__achievement_ban_la_trieu_phu.png', 'atp__achievement_bat_kha_chien_bai.png', 'atp__achievement_bat_nhip_chien_thang.png', 'atp__achievement_buc_toc_vuot_len.png', 'atp__achievement_cham_tay_chien_thang.png', 'atp__achievement_chien_thang_mo_hang.png', 'atp__achievement_dai_kien_tuong.png', 'atp__achievement_doc_co_cau_bai.png', 'atp__achievement_everest.png', 'atp__achievement_fansipan.png', 'atp__achievement_hat_trick.png', 'atp__achievement_huyen_thoai.png', 'atp__achievement_keo_ngot.png', 'atp__achievement_khoi_dau_manh_me.png', 'atp__achievement_khoi_dong_thanh_cong.png', 'atp__achievement_kho_bau_kien_thuc.png', 'atp__achievement_kien_tuong.png', 'atp__achievement_ky_phung_dich_thu.png', 'atp__achievement_nha_hien_triet.png', 'atp__achievement_olympus.png', 'atp__achievement_than_rua.png', 'atp__achievement_than_toc_tao_bao.png', 'atp__achievement_thap_toan_thap_my.png', 'atp__achievement_tho_san_chien_thang.png', 'atp__achievement_vua_cam_hoa.png', 'atp__achievement_yeu_hoa_binh.png', 'atp__achievement_item_default.png'];

var ArchivementMax = {
    BAIKHONGNAN: 10, //thua 10lần <mốc 5
    BANLATRIEUPHU: 1, // đạt đc triệu phú
    BATKHACHIENBAI: 10, //10 lần liên tiếp trả lời đc >= mốc 10
    BATNHIPCHIENTHANG: 10, // 10 lần trả lời >=mốc 10 (k cần liên tiếp)
    BUCTOCVUOTLEN: true, // câu hỏi min , nếu đạt khoảng cách 5 câu hỏi ngay sau lần chơi min
    CHAMTAYCHIENTHANG: true, // thua hoặc dừng lại ở câu hỏi số 15 (k trả lừi đc)
    CHIENTHANGMOHANG: true, // vượt qua mốc 10 lần đầu tiên
    DAIKIENTUONG: 5, //5 lần là triệu phú
    DOCCOCAUBAI: 10, // 10 lần triệu phú
    EVEREST: 15, // câu hỏi cao nhất từng trả lời đc, từ 1->15
    FANSIPAN: 8, // câu hỏi cao nhât từng đạt được, 1->8
    HATTRICK: 3, //3 lần liên tiếp đạt mốc >=10
    HUYENTHOAI: 50, //50 lần đạt mốc >=12
    KEONGOT: 20, // 20 lần kết thúc ở mốc >=5 và mốc <10
    KHOIDAUMANHME: true, // lần đầu đạt đến mốc >=5
    KHOIDONGTHANHCONG: true, //lần đầu đạt đến mốc >=10
    KHOBAUKIENTHUC: 15, //15 lần đạt >=8
    KIENTUONG: 20, //20 lần đạt mốc >=10
    KYPHUNGDICHTHU: 10, //thách đấu: hòa hoặc thắng 20
    NHAHIENTRIET: 30, // 30 lần đạt mốc >=10
    OLYMPUS: 10, //câu hỏi cao nhât từng đạt được, 1->10
    THANRUA: 20, // 20 lần thua <mốc 5
    THANTOCTAOBAO: 20, // 20 lần trả lời >=mốc 5 và <=mốc 10
    THAPTOANTHAPMY: 10, // 10 lần k trả lời đc hoặc dừng lại ở câu hỏi số 11
    THOSANCHIENTHANG: 30, // 30 lần >= mốc 10
    VUACAMHOA: 10, // thách đấu: hòa 10 lần
    YEUHOABINH: 20 // thách đấu, hòa 20 lần
};
var ls = cc.sys.localStorage;
var P_PATH = 'resources/textures/archivement/';
var ArchivementPrefab = cc.Class({
    'extends': cc.Component,

    properties: {
        archiveIcon: cc.Sprite,
        lbName: cc.Label,
        progress: cc.ProgressBar,
        dialog: cc.Prefab
    },
    onLoad: function onLoad() {},
    init: function init(number, properties, data) {
        var str = ArchivementName[number].name;
        if (str.length > 15) str = str.substring(0, 15) + "...";
        this.lbName.string = str;
        if (data === true || data === false) {
            if (data === true) {
                this.changeSprite(number);
            } else {
                this.changeSprite(27);
                this.progress.progress = 0;
            }
        } else {
            var progress = data / ArchivementMax[properties];
            if (progress === 1) {
                this.changeSprite(number);
            } else {
                this.progress.progress = progress;
                this.changeSprite(27);
            }
        }
        // if(type===false){ //default
        //     this.changeSprite(27);
        // }else{// what type, what number
        //     this.changeSprite(number);
        // }
    },
    changeSprite: function changeSprite(number) {
        var path = P_PATH + ArchivementPath[number];
        var url = cc.url.raw(path);
        var texture = cc.textureCache.addImage(url);
        var rect = this.archiveIcon.spriteFrame.getRect();
        if (cc.sys.isNative) {
            this.archiveIcon.spriteFrame = cc.SpriteFrame(texture);
        } else {
            this.archiveIcon.spriteFrame = new cc.SpriteFrame(texture);
        }
        // this.archiveIcon.spriteFrame= new cc.SpriteFrame(texture,rect);
        // this.archiveIcon.spriteFrame.setTexture(texture);
    }

    /*
    
    item: NUMBER,NAME,PATH,COUNT,MAX
    */

});
//load json đối tượng lưu trữ của archivement
module.exports = {
    ArchivementNumber: ArchivementNumber,
    ArchivementKey: ArchivementKey,
    ArchivementName: ArchivementName,
    ArchivementPath: ArchivementPath,
    ArchivementPrefab: ArchivementPrefab,
    ArchivementMax: ArchivementMax
};