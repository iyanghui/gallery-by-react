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
        singleImgData.url = require('../images/' + singleImgData.fileName);

        imgDatasArr[i] = singleImgData;
    }
    return imgDatasArr;
})(imgDatas);


var imageURL = require('../images/yeoman.png');

var GalleryByReactApp = React.createClass({
    render: function() {
        return (
            <section className="stage">
                <section className="img-sec">
                </section>
                <nav className="controller-nav">
                </nav>
            </section>
        );
    }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;