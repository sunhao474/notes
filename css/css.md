# CSS

1. [盒子模型](#1)
2. [BFC](#2)
3. [水平居中的方法](#3)
4. [像素](#4)
5. [em/px/rem/vh/vw](#5)
6. [flex](#6)
7. [grid](#7)
8. [回流和重绘](#8)
9. [css预处理语言](#9)
10. [选择器](#10)
11. [省略号])(#11)
12. [三角形](#12)
13. [动画](#13)

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
 css的长度单位可以分为相对长度单位和绝对长度单位
 相对长度单位：
* px
    - px 是绝对长度。只是在移动端中存在设备像素比。
* em
    - 相对于当前元素的`font-size`值大小。
* rem
    - 同上，但是是 root-em 相对于html的根元素`font-size`值大小。
* vh、vw
    - 窗口宽高比。如果100vh 就是100%当前窗口高。

---

## <a id="6">flex</a>
即弹性布局，目前最为方便的布局。当容器css属性声明`display: flex`时，容器内部子元素按照弹性布局排列。
![](https://static.vue-js.com/fbc5f590-9837-11eb-ab90-d9ae814b240d.png)
容器中默认存在两条轴：`主轴`和`交叉轴`，呈90度关系。子元素默认按照主轴方向排列，主轴默认是横向排列的，可以通过`flex-direction`改变主轴方向。
详情可以搜阮一峰的文章，讲解的比较详细。
主元素属性有：
- flex-direction
- flex-wrap
- flex-flow
- justify-content
- align-items
- align-content

容器成员的属性有：  
- `order`：决定当前子元素该排列在第几个
- `flex-grow`：决定当有剩余空间时，项目如何分配剩余空间
- `flex-shrink`：决定当宽度不足时，项目如何挤压空间
- `flex-basis`：决定项目的初始尺寸。
- `flex`：上述三个属性的集合体。这里注意：当flex-wrap为no-wrap，这些属性才有意义
- `align-self`：覆盖父元素的align-items，有自己自由的排列模式。

---

## <a id="7">grid</a>
待补

---

## <a id="8">回流（重排）和重绘</a>
* 回流：布局引擎会根据各种样式计算每个盒子在页面上的大小与位置
    - 添加或删除可见的DOM元素
    - 元素的位置发生变化
    - 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
    - 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代
    - 页面一开始渲染的时候（这避免不了）
    - 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）
    - 特定属性的值：需要通过即时计算得到，所以为了获取值也会进行回流
    > offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight，以及getComputedStyle方法
* 重绘：当计算好盒模型的位置、大小及其他属性后，浏览器根据每个盒子特性进行绘制
    - 颜色的修改
    - 文本方向的修改
    - 阴影的修改

### 浏览器的优化机制
因为重排会造成损耗，大多数浏览器会将一些触发重排的动作加入队列。但是当你使用类似 offsetTop 等方法，会清空队列。

- 如果想设定元素的样式，通过改变元素的 `class` 类名 (尽可能在 DOM 树的最里层)
- 避免设置多项内联样式
- 应用元素的动画，使用 `position` 属性的 `fixed` 值或 `absolute` 值(如前文示例所提)
- 避免使用 `table` 布局，`table` 中每个元素的大小以及内容的改动，都会导致整个 `table` 的重新计算
- 对于那些复杂的动画，对其设置 `position: fixed/absolute`，尽可能地使元素脱离文档流，从而减少对其他元素的影响
- 使用css3硬件加速，可以让`transform`、`opacity`、`filters`这些动画不会引起回流重绘
- 避免使用 CSS 的 `JavaScript` 表达式
- 在使用 `JavaScript` 动态插入多个节点时, 可以使用`DocumentFragment`. 创建后一次插入. 就能避免多次的渲染性能
- display：none之后操作不会引起回流、重绘。（离线操作）

---
## <a id="9">css预处理语言</a>
扩充`css`语言，增加了变量、函数等功能，目的在于高效维护`css`。  
包含一套自定义的语法和解析器，根据语法自定义样式规则，最终编译为`css`原文件

* sass
* less
* stylus

这些预处理语言主要具有以下特性：

* 变量
* 作用域
* 代码混合
    - 最为精髓的部分，类似函数化。举例less：
        ``` less
            .alert {
                font-weight: 700;
            }
            
            // @color是变量名，red是如果不提供变量的默认属性
            .heighlight(@color: red) {
                font-size: 1.2em;
                color: @color;
            }            
        ```
* 嵌套
* 代码模块化

---

## <a id="10">选择器</a>
用于选取dom元素。  

有如下常用选择器：
* id选择器(#)
* 类选择器(.)
* 标签选择器，以标签名直接进行选择
* 后代选择器(a b),选择a选择器元素里所有b选择器，a和b都可以是任意选择器
* 子选择器(a>b)，仅选择父元素为a选择器的b选择器。
* 相邻同胞选择器(a+b)选择紧接在a之后的b

还有一些伪类选择器：

* `:link`: 选择未被访问的链接
* `:visited`: 选择已经被访问的链接
* `:active`: 选择活动链接
* `:hover`: 选择指针覆盖的元素
* `:focus`: 选择获取焦点的元素
* `:first-child`: 选择第一个孩子，这类有很多，可以详细查询 mdn

伪元素选择器：

* `:first-letter`: 选取指定选择器的首字母
* `:first-line`: 选取指定选择器的首行
* `:before`: 在指定元素前插入内容
* `:after`:在指定元素后插入内容

dom属性选择器：

* a[title]: 选择具有 title 属性的 a 选择器
* a[title="hello"]: 选择具有 title 属性且为 `hello`
* a[title~="hello"]: 属性可能是对象，该对象包含 `hello`
* a[title|="hellow"]: 属性开头是 `hello`

css3 新增的选择器：
* 层次选择器(a~b): 选择所有b选择器前面有a选择器的对象
* 伪类选择器：
    - :first-of-type 表示一组同级元素中其类型的第一个元素
    - :last-of-type 表示一组同级元素中其类型的最后一个元素
    - :only-of-type 表示没有同类型兄弟元素的元素
    - :only-child 表示没有任何兄弟的元素
    - :nth-child(n) 根据元素在一组同级中的位置匹配元素
    - :nth-last-of-type(n) 匹配给定类型的元素，基于它们在一组兄弟元素中的位置，从末尾开始计数
    - :last-child 表示一组兄弟元素中的最后一个元素
    - :root 设置HTML文档
    - :empty 指定空的元素
    - :enabled 选择可用元素
    - :disabled 选择被禁用元素
    - :checked 选择选中的元素
    - :not(selector) 选择与 <selector> 不匹配的所有元素
* 属性选择器：
    - a[title*="hello"]: title 属性包含 value 的所有元素
    - a[title^="hello"]: 开头为 hello
    - a[title$="hello"]: 结尾为 hello

### 属性优先级：
> 内联 > ID选择器 > 类选择器 > 标签选择器
其实是计算一个值，每个优先级有不同的权重，对应上面就是:
> 1000 > 100 > 10 > 1

### 属性继承
在`css`中，子元素会根据父元素的属性，继承一些属性的表现。

---

## <a id="11">省略号</a>

### 单行文本溢出

- text-overflow：规定当文本溢出时，显示省略符号来代表被修剪的文本
    - clip: 直接裁掉
    - ellipsis: 显示省略号
    - 只有在设置了`overflow:hidden`和`white-space:nowrap`才能够生效的
- white-space：设置文字在一行显示，不能换行
- overflow：文字长度超出限定宽度，则隐藏超出的内容

### 多行文本溢出

有两种策略，基于高度截断和基于行数截断。

#### `高度截断`： 伪元素+定位

- position: relative：为伪元素绝对定位
- overflow: hidden：文本溢出限定的宽度就隐藏内容）
- position: absolute：给省略号绝对定位
- line-height: 20px：结合元素高度,高度固定的情况下,设定行高, 控制显示行数
- height: 40px：设定当前元素高度
- ::after {} ：设置省略号样式

``` html
<style>
    .demo {
        position: relative;
        line-height: 20px;
        height: 40px;
        overflow: hidden;
    }
    .demo::after {
        content: "...";
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 0 20px 0 10px;
    }
</style>

<body>
    <div class='demo'>这是一段很长的文本</div>
</body>
```
首先...只会出现在div的尾部，只能在文字的长度恰好的情况下进行合适的显示，然而如何合理保持文字长度是个问题。

#### `高度截断`：
- -webkit-line-clamp: 用来限制一个块元素显示的文本的行数，为了实现该效果，需要组合其他webkit属性；
- display: -webkit-box: 结合上个属性，将对象作为弹性伸缩盒子模型显示
- -webkit-box-orient: vertical: 和1结合使用，设置或检索伸缩盒对象的子元素的排列方式。
- overflow: hidden: 文本溢出限定的宽度就隐藏内容
- text-overflow: ellipsis：用省略号隐藏溢出

```html

<style>
    p {
        width: 400px;
        border-radius: 1px solid red;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
<p>
    这是一些文本这是一些文本这是一些文本这是一些文本这是一些文本
    这是一些文本这是一些文本这是一些文本这是一些文本这是一些文本
</p >

```

---

## <a id="12">三角形</a>
首先放一个具有width、height的div，给他一个有点长的border：
<style>
    .border {
        width: 50px;
        height: 50px;
        border: 20px solid;
        border-color: #96ceb4 #ffeead #d9534f #ffad60;
    }
</style>
<div class="border"></div>
观察相互border之间边界的补齐方式：是以div对角线为界分别填充的，如果把height和witdh设为0：
<style>
    .border2 {
        width: 0px;
        height: 0px;
        border: 20px solid;
        border-color: #96ceb4 #ffeead #d9534f #ffad60;
    }
</style>
<div class="border2"></div>
会发现有4个三角形。只要根据需要隐藏不需要的方向的三角形。根据css表现而言，隐藏相邻方向的两个三角形。
<style>
    .border3 {
        width: 0px;
        height: 0px;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 20px solid #d9534f;
    }
</style>
<div class="border3"></div>
有趣的是，如果只设置某一邻边为隐藏，就会得到一个一半的三角形
<style>
    .border4 {
        width: 0px;
        height: 0px;
        /* border-left: 20px solid transparent; */
        border-right: 20px solid transparent;
        border-bottom: 20px solid #d9534f;
    }
</style>
<div class="border4"></div>
如果要实现空心三角形也很简单，利用伪元素after再画一个相对小一点的三角形遮盖。
<style>
.border5 {
    width: 0;
    height: 0;
    border-style:solid;
    border-width: 0 50px 50px 50px;
    border-color: transparent transparent #d9534f;
    position: relative;
}
.border5:after {
    content: '';
    border-style: solid;
    border-width: 0 40px 40px 40px;
    border-color: transparent transparent #96ceb4;
    position: absolute;
    top: 6px;
    left: -40px;
}
</style>
<div class="border5"></div>

---

## <a id="13">动画</a>

* transition 实现渐变动画（过渡）
* transform 转变动画
* animation 实现自定义动画

### transition 过渡

属性：
* property：填写需要变化的css属性
* duration：完成过渡效果需要的时间单位
* timing-function：完成效果的速度曲线
    - linear: 匀速
    - ease: 慢-快-慢
    - ease-in: 逐渐加快
    - ease-out: 逐渐降速
    - ease-in-out: 上述两者结合
* delay: 动画效果的延迟触发时间
<style>
       .base {
            width: 100px;
            height: 100px;
            display: inline-block;
            background-color: #0EA9FF;
            border-width: 5px;
            border-style: solid;
            border-color: #5daf34;
            transition-property: width, height, background-color, border-width;
            transition-duration: 2s;
            transition-timing-function: ease-in-out;
            transition-delay: 100ms;
        }

        /*简写*/
        /*transition: all 2s ease-in 500ms;*/
        .base:hover {
            width: 200px;
            height: 200px;
            background-color: #5daf34;
            border-width: 10px;
            border-color: #3a8ee6;
        }
</style>
<div class="base"></div>

### transform
配合transition使用。对象元素不能是inline元素，使用前需要改变display属性。  
<style>
    .base2 {
        transform: none;
        transition-property: transform;
        transition-delay: 5ms;
    }

    .base2:hover {
        transform: scale(0.8, 1.5) rotate(35deg) skew(5deg) translate(15px, 25px);
    }
</style>
 <div class="base base2"></div>

 ### animation
 