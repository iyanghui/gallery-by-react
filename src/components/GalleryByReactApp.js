'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.scss');

//获取图片相关的数据
var imgDatas = require('../data/imageDatas.json');

//利用自执行函数将图片名信息转换为图片URL信息
imgDatas = (function genImageDatas(imgDatasArr) {
    for (var i = 0, j = imgDatasArr.length; i < j; i++) {
        var singleImgData = imgDatasArr[i];
        singleImgData.imgUrl = require('../images/' + singleImgData.fileName);

        imgDatasArr[i] = singleImgData;
    }
    return imgDatasArr;
})(imgDatas);


/**
 * 获取区间内的随机值
 */
function getRangeRandom(low, hight) {
    return Math.ceil(Math.random() * (hight - low) + low);
}

var ImgFigure = React.createClass({
    render: function() {

        var styleObj = {};

        //如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        return (
            <figure className="img-figure" style={styleObj}>
                <img src={this.props.data.imgUrl}
                    alt={this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">
                        {this.props.data.title}
                    </h2>
                </figcaption>
            </figure>
        );
    }
});



var GalleryByReactApp = React.createClass({

    Constant: {
        centerPos: {
            left: 0,
            top: 0
        },
        hPosRange: { //水平方向的取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: { //垂直方向的取值范围
            x: [0, 0],
            topY: [0, 0]
        }
    },

    /**
     * 重新布局左右图片
     * @param centerIndex 指定居中排列的那个图片
     */
    rearrange: function(centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,

            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,

            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,

            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //取一个或者不取

            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);


        //首先居中centerIndex 的图片
        imgsArrangeCenterArr[0].pos = centerPos;

        //取出要布局丄侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // console.log(imgsArrangeTopArr);
        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index) {
            imgsArrangeTopArr[index].pos = {
                top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            };
        });

        //布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLOrX = null;

            //取前半部分布局左边， 后半部分布局右边
            if (i < k) {
                hPosRangeLOrX = hPosRangeLeftSecX;
            } else {
                hPosRangeLOrX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i].pos = {
                top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLOrX[0], hPosRangeLOrX[1])
            };

        }

        // console.log(hPosRangeLeftSecX)

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });

    },

    getInitialState: function() {
        return {
            imgsArrangeArr: [
                /*{
                    pos: {
                        left: '0',
                        top: '0'
                    }
                }*/
            ]
        };
    },
    //组件加载以后，为每张图片计算取值范围
    componentDidMount: function() {

        //取得舞台的大小
        var stageDOM = React.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);
        // console.log(stageW);
        //拿到一个imrFigure的大小
        var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        console.log(stageW);
        //计算左侧、右侧取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //计算上侧取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);


    },

    render: function() {

        var controllerUnits = [],
            imgFigures = [];

        imgDatas.forEach(function(value, index) {

            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    }
                };
            }

            imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} />);
        }.bind(this));

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
});


React.render(
    <GalleryByReactApp />,
    document.getElementById('content')
); // jshint ignore:line

module.exports = GalleryByReactApp;