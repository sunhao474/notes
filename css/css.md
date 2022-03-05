# CSS

1. [盒子模型](#1)
2. [BFC](#2)
3. [水平居中的方法](#3)
4. [像素](#4)
5. [em/px/rem/vh/vw](#5)

---

# css3新特性
* 定位选择器：
 ![](https://static.vue-js.com/e368cf20-9b5e-11eb-85f6-6fac77c0c9b3.png)
* 新的边框
    - border-radius: 创建圆角边框
    - box-shadow： 为元素添加阴影
    - border-image： 使用图片绘制边框

* box-shadow
* 背景的新属性：
    - background-clip: 用于设定背景的覆盖区域
    - background-origin： 用于设定背景图片的左上角对齐
    - background-size： 调整背景图片的大小 
* 文字
    - word-wrap 设置文字换行： `normal | break-all`
    - text-overflow 当前行超过容器边界，如何显示: `clip | ellipsis`
    - text-shadow 为文本设定阴影.
    - text-decoration 深层次的文字渲染，可以修改文字内部、边界的颜色，以及边界的宽度 `text-fill-color | text-stroke-color | text-stroke-width`
* 颜色
    - rgba
    - hala
* 过渡 transition
    - `transition-property | transition-duration | transition-timing-function | transition-delay` 
* 线性变换 transform 
    - `translate` 位移
    - `scale` 缩放
    - `rotate()` 旋转
    - `skew` 倾斜
* 动画 animation 
* 颜色渐变
    - linear-gradient 线性渐变（笛卡尔坐标系渐变）
    > background-image: linear-gradient(direction, color-stop1, color-stop2, ...);
    - radial-gradient 径向渐变(极坐标渐变)
    > linear-gradient(0deg, red, green); 
* flex 布局
* grid 布局
* 媒体查询
* 混合模式
---

## <a id="1">盒子模型</a>
当一个文档进行布局的时候，浏览器的渲染引擎会根据标准之一的 css 基础盒模型将所有元素表示为一个矩形的盒子。  
一个盒子由四个部分组成`content`, `padding`, `border`, `margin`
由内向外，依次是：
* content: 实际内容，显示文本和图像
* padding: 内边距，清除内容周围的区域，透明，取值不能为负，受到 background 属性影响
* border: 边框
* margin: 外边距，在元素外部创建的额外空白。

盒子模型分两种：
* 标准盒模型：浏览器默认
    - 盒子的总宽度 = width + padding + border + margin
    - 高度同理。
    - width / height 是不包括 padding 和 border 的
* 怪异盒模型
    - 盒子总宽度 = width + margin  
    - width / height 包括了padding和border

---

## <a id="1">BFC</a>
布局经常的问题：
* 元素高度消失
* 两栏布局无法自适应
* 两个元素的间距不符合设置
* ...

如果元素之间的关系有相互的影响，导致了意料之外的情况。  
`BFC`，即( Block Formatting Context ),即块级格式化上下文，它是页面中的一块渲染区域，并且有一套属于自己的渲染规则：
* 内部的盒子会在垂直方向上一个接一个的放置
* 对于同一个BFC的两个相邻的盒子margin会发生重叠，与方向无关。
* 每个元素的左外边距与包含块的左边界接触（从左到右），即使浮动元素也是如此。
* BFC的区域不会与float的元素区域重叠
* 计算BFC的高度时，浮动子元素也参与计算。
* BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然。

`BFC`目的是形成一个相对于外界完全独立的空间，让内部的子元素不会影响到外部的元素

### 形成条件
- 根元素，即HTML元素
- 浮动元素：float值为left、right
- overflow值不为 visible，为 auto、scroll、hidden
- display的值为inline-block、inltable-cell、table-caption、table、inline-table、flex、inline-flex、grid、inline-grid
- position的值为absolute或fixed

### 应用场景
* 防止margin重叠

```html
<style>
    p {
        color: #f55;
        background: #fcc;
        width: 200px;
        line-height: 100px;
        text-align:center;
        margin: 100px;
        /* float: right; */ /*  */
    }
</style>
<body>
    <p>Haha</p>
    <p>Hehe</p>
</body>
```
上图的代码，两个p之间，如果按照我们的设想，应该是一共举例200px的，但是body中形成了BFC，造成塌陷，p之间只有100px的间隔。（以最大的为准，如果第一个P的`margin`为80的话，两个P之间的距离还是100，以最大的为准。）

如何破坏这种现象呢？如果p自身可以形成BFC，则可以让两个P不属于同一个BFC，就不会出现重叠。  
使用float: right，让p自己形成BFC。

* 清除内部浮动
```html
<style>
    .par {
        border: 5px solid #fcc;
        width: 300px;
    }
 
    .child {
        border: 5px solid #f66;
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="par">
            <div class="child"></div>
            <div class="child"></div>
    </div>
</body>
```
这个代码中，两个child都是浮动元素，所以父元素不会计算高度，高度就压缩了。
如果把par加上一个`overflow: hidden`，就能让par内部形成BFC，内部的浮动元素高度就会被par计算。

### 自适应多栏布局

```html
<style>
    body {
        width: 300px;
        position: relative;
    }
 
    .aside {
        width: 100px;
        height: 150px;
        float: left;
        background: #f66;
    }
 
    .main {
        height: 200px;
        background: #fcc;
    }
</style>
<body>
    <div class="aside"></div>
    <div class="main"></div>
</body>
```
这套代码，虽然aside为float：left，但是依然会跟main重叠。（每个元素的左外边距与包含块的左边界接触（从左到右），即使浮动元素也是如此。）我们把mian加上`overflow: hidden`，就可以让main脱离body的bfc，自己形成一个BFC，跟aside不在同一个BFC。这样，main和aside就会挨个排列，形成两栏布局。

## <a id="3">水平居中的方法</a>
有两种场景：分别为知道要居中元素的宽高，以及不知道宽高。这里我们只处理不知道宽高的情况，比较通用。
* `transform:translate(-50%, -50%)`布局
``` html
<style>
    .father {
        position: relative;
        width: 200px;
        height: 200px;
        background: skyblue;
    }
    .son {
        position: absolute;
        top: 50%;
        left: 50%;
        /* 用这个属性就不需要宽高了 */
        transform: translate(-50%,-50%);

        width: 100px;
        height: 100px;
        background: red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```

* table布局  
父元素添加属性`display: table-cell`，子元素设置`display：inline-block`。设置`vertical`和`text-align`可以让所有的行内块级元素水平垂直居中。
``` html
<style>
    .father {
        display: table-cell;
        width: 200px;
        height: 200px;
        background: skyblue;
        vertical-align: middle;
        text-align: center;
    }
    .son {
        display: inline-block;
        width: 100px;
        height: 100px;
        background: red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```

* flex弹性布局
这个就简单了,设置父组件为`display: flex`，然后就是`justify-content: center;`和`align-items: center`结合使用了。

---

## <a id="4">像素</a>
### px
css pixel，px 是一个相对单位，参照标准是设备像素（device pixel）、一般情况，页面缩放为 1:1 ,则1个css像素就等于一个设备独立像素。  
但是：
* 在同一个设备上，每1个 CSS 像素所代表的设备像素是可以变化的（比如调整屏幕的分辨率）
* 在不同的设备之间，每1个 CSS 像素所代表的设备像素是可以变化的（比如两个不同型号的手机）
* 在页面进行缩放操作也会 引起`css`中`px`的变化

px会受到下面的因素的影响而变化：

* 每英寸像素（PPI）
* 设备像素比（DPR）

### 设备像素
指设备能控制显示的最小物理单位
 ![](https://static.vue-js.com/cffc6570-91f2-11eb-ab90-d9ae814b240d.png)
这是一个绝对单位，单位为`pt`

### 设备独立像素
设备独立像素（Device Independent Pixel）：与设备无关的逻辑像素，代表可以通过程序控制使用的虚拟像素，是一个总体概念，包括了CSS像素。一个设备独立像素里可能包含1个或者多个物理像素点，包含的越多则屏幕看起来越清晰。  
至于 1 个虚拟像素被换算成几个物理像素，这个数值我们称之为设备像素比，也就是下面介绍的`dpr`

### dpr
即设备像素比，代表设备独立像素到设备像素的转换关系，在`javascript`中可以通过`window.devicePixelRatio`获取。
 ![](https://static.vue-js.com/dd45e2b0-91f2-11eb-ab90-d9ae814b240d.png)

 ![](https://static.vue-js.com/e63cceb0-91f2-11eb-ab90-d9ae814b240d.png)
 当`dpr`为3，那么`1px`的`CSS`像素宽度对应`3px`的物理像素的宽度，1px的`CSS`像素高度对应`3px`的物理像素高度

 ### ppi
 ppi （pixel per inch），每英寸像素，表示每英寸所包含的像素点数目，更确切的说法应该是像素密度。数值越高，说明屏幕能以更高密度显示图像

 ---

 ## <a id="5">css单位</a>
 