export default class DrawSharingDiagram {
  constructor() {
    /**
     * 判断字符串中是否存在换行符
     * @param {string} str - 要检查的字符串
     * @returns {boolean} - 存在换行符返回 true，否则返回 false
     */
    const noLineBreaks = (str = '') => {
      return str.indexOf('\n') === -1;
    };
    /**
     * 根据画布高度和元素高度计算画布最多能容纳多少行
     * @param {number} canvasHeight - 画布高度
     * @param {number} elHeights - 元素高度
     * @returns {number} - 最大行数（向下取整）
     */
    const calculateMaxLines = (canvasHeight, elHeights) => {
      return Math.floor(canvasHeight / elHeights);
    };
    /**
     * 判断画布最大行数是否能容纳所有元素
     * @param {number} maxLines - 最大行数
     * @param {number} columns - 列数
     * @param {Array} drawData - 要绘制的数据数组
     * @returns {boolean} - 如果能容纳所有元素返回 true，否则返回 false
     */
    const isAllViews = (maxLines, columns, drawData) => {
      return maxLines * columns >= drawData.length;
    };
    /**
     * 根据画布高度、元素高度、最大行数和沟槽计算最后一行的高度及画布剩余空白高度
     * @param {number} canvasHeight - 画布高度
     * @param {number} elHeights - 元素高度
     * @param {number} maxLines - 最大行数
     * @param {number} trench - 沟槽
     * @returns {object} - 包含最后一行高度和剩余高度的对象
     */
    const calculateLastLineHeight = (canvasHeight, elHeights, maxLines, trench) => {
      const lastLineHeight = elHeights * maxLines - trench;
      return { lastLineHeight, remainingHeight: canvasHeight - lastLineHeight };
    };
    /**
     * 根据画布高度、元素高度和其他配置参数计算绘制参数
     * @param {Array} drawData - 要绘制的数据数组
     * @param {object} options - 包含配置选项
     * @returns {object} - 包含绘制参数的对象
     */
    this.palette = (drawData, options = {}) => {
      // 使用传入的配置对象或默认值(rpx)
      const {
        canvasWidth = 750, // 画布宽度
        canvasHeight = 600, // 画布高度
        columns = 5, // 列数
        trench = 10, // 沟槽
        padding = 10, // 内边距
        color = '#333', // 字体颜色
        fontSize = 28, // 字体大小
        lineHeight = 32, // 行高
        bgc = '#ccc', // 背景色
        bdrs = 16, // 圆角大小
        bottomInfo = '(●ˇ∀ˇ●)还有很多显示不下了~', // 底部提示信息
      } = options;

      const views = [];
      const elHeight = lineHeight * 2 + padding * 2; // 元素高度
      const elWidth = (canvasWidth - (columns - 1) * trench) / columns; // 元素宽度
      const elHeights = elHeight + trench; // 单个元素总高度(包含沟槽)

      let maxLines = calculateMaxLines(canvasHeight, elHeights); // 画布最多能绘制多少行
      let {
        lastLineHeight,
        remainingHeight,
      } = calculateLastLineHeight(canvasHeight, elHeights, maxLines, trench); // 计算最后一行高度和画布剩余空白高度
      const canShowAllViews = isAllViews(maxLines, columns, drawData); // 判断是否可以显示所有视图

      // 如果画布不能容纳所有元素时且画布剩余空白的高度小于32时,maxLines需要减1,使底部提示能够正常显示
      const showBottomInfo = !canShowAllViews && remainingHeight < lineHeight;
      if (showBottomInfo) {
        maxLines--;
        // 重新计算最后一行高度及画布剩余空白高度
        const {
          lastLineHeight: newLastLineHeight,
          remainingHeight: newRemainingHeight,
        } = calculateLastLineHeight(canvasHeight, elHeights, maxLines, trench);
        lastLineHeight = newLastLineHeight;
        remainingHeight = newRemainingHeight;
      }
      // 最多绘制多少个元素
      const maxViews = maxLines * columns >= drawData.length ? drawData.length : maxLines * columns;
      // 生成views对象
      for (let i = 0; i < maxViews; i++) {
        const row = Math.floor(i / columns);
        const col = i % columns;
        const p_y = noLineBreaks(drawData[i]) ? lineHeight / 2 + padding : padding; // 只有一行文字时，需要额外增加padding，使文字垂直居中
        const maxLines = noLineBreaks(drawData[i]) ? 1 : 2; // 只有一行文字时，只绘制一行
        views.push({
          type: 'text',
          text: drawData[i],
          css: {
            top: `${row * (elHeight + trench) + p_y}rpx`,
            left: `${col * (elWidth + trench) + padding}rpx`,
            width: `${elWidth}rpx`,
            height: `${elHeight}rpx`,
            fontSize: `${fontSize}rpx`,
            lineHeight: `${lineHeight}rpx`,
            textAlign: 'center',
            color: color,
            background: bgc,
            borderRadius: `${bdrs}rpx`,
            padding: `${p_y}rpx ${padding}rpx`,
            maxLines: `${maxLines}`,
          },
        });
      }
      // 添加底部提示信息
      if (!canShowAllViews) {
        views.push(
          /* {
            type: 'rect',
            css: {
              top: `${lastLineHeight}rpx`,
              color: 'rgba(255, 0, 0, 0.5)',
              width: `${remainingHeight}rpx`,
              height: `${remainingHeight}rpx`,
            },
          }, */
          {
            type: 'text',
            text: bottomInfo,
            css: {
              top: `${lastLineHeight + (remainingHeight - fontSize) / 2}rpx`,
              left: `${canvasWidth / 2}rpx`,
              textAlign: 'center',
              align: 'center',
              color: color,
              fontSize: `${fontSize}rpx`,
              lineHeight: `${lineHeight}rpx`,
              width: '100%',
              // borderWidth: '2rpx',
              // borderColor: '#f00',
            },
          },
        );
      }
      // 返回绘制参数
      return {
        width: `${canvasWidth}rpx`,
        height: `${canvasHeight}rpx`,
        // background: '#eee',
        views: views,
      };
    };
  }
}
