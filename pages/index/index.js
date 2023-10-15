import { drawData } from '../../utils/drawData';
import DrawSharingDiagram from '../../utils/drawSharingDiagram';

Page({
  data: {
    data: {},
    shareImage: '',
  },

  onLoad() {
    this.setData({
      data: new DrawSharingDiagram().palette(drawData),
    });
  },

  onImgOK(e) {
    this.setData({ shareImage: e.detail.path });
  },

  onShareAppMessage() {
    return {
      title: '绘制名单',
      path: 'pages/index/index',
      imageUrl: this.data.shareImage,
    };
  },
});
