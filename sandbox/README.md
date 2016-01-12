mokoversity2-sandbox
====================

Sandbox environment of Mokoversity

## 環境需求

* Node.js v0.10.8+
* Chrome 瀏覽器

### 主機設定

在本機測試時，為了能順利呼叫 www.mokoversity.com 上的 REST APIs，請將 sandbox.mokoversity.com 指定為 127.0.0.1，並瀏覽 sandbox.mokoversity.com。

Mac/Linux 系統設定方式如下。

1. 開啟 /etc/hosts

```
$ sudo open /etc/hosts
```

2. 加入下列設定:

```
127.0.0.1 sandbox.mokoversity.com
```

## 安裝方式

1. 取回 Git repo:

```
$ git clone git@github.com:MokoVersity/mokoversity2-sandbox.git
```

2. 安裝 mdoules:

```
$ cd mokoversity2-sandbox
$ npm i
```

3. 執行主程式:

```
$ sudo node app.js
```

4. 請使用 Chrome 瀏覽器，瀏覽 http://sandbox.mokoversity.com


Styling
====================

Mokoversity 客製化的 styles，主要位於：

* less/Flat-UI-Pro-1.2.3/less/modules/mokoversity.less - 對 Flat UI Pro 的 override
* public/openmind/css/mokoversity.less - 對 Openmind framework 的 override
* public/openmind/css/color-default.leon.less - Leon 的配色

### 編譯 LESS

監控方式:

```
$ grunt watch
```

手動方式:

```
$ grunt less
```

