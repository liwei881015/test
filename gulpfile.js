'use strick';

//创建一个全局变量，用于定义项目目录
var app = {
	srcPath:'src/',//项目源码目录
	devPath:'build/',//项目构建目录
	proPath:'dist/'//项目目录
}
var proName = "itany";

//加载模块
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();//动态加载模块，package.json代码进行自动获取和加载，最后的()不能省略
var browserSync = require('browser-sync').create();

//html的压缩
gulp.task('html',function(){
	gulp.src(app.srcPath+'**/*.html')
	//gulp-plumber 是让gulp异常不去中断监视，并对gulp的异常进行封装——>error
	//通过动态组件模块加载组件功能
	.pipe($.plumber())
	.pipe(gulp.dest(app.devPath))
	.pipe($.htmlmin({
		collapseWhitespace:true,//去除html中的空白区域
		removeComments:true,//删除html中的注释
		collapseBooleanAttributes:true,//删除html中boolean类型的属性值
		removeEmptyAttributes:true,//删除html标签中的空属性 值为""
		removeScriptTypeAttributes:true,//删除script标签的type属性
		removeStyleLinkTypeAttributes:true//删除style和link标签的type属性
	}))
	.pipe(gulp.dest(app.proPath))
	// .pipe(browserSync.stream());//浏览器的同步
}); 

//less的编译压缩
gulp.task('less',function(){
	gulp.src(app.srcPath+'less/**/*.less')
		.pipe($.plumber())
		.pipe($.less())
		//为css属性添加浏览器匹配前缀 指定添加规则
		.pipe($.autoprefixer({
			browsers:['last 20 versions'],//使css属性兼容主流浏览器的最新的20歌版本
			cascode:false//是否美化属性值，默认是true
		}))
		.pipe(gulp.dest(app.devPath+'css'))
		.pipe(gulp.dest(app.proPath+'css'))
		.pipe($.cssmin())
		//gulp-rename 对写入文件进行重新命名
		.pipe($.rename({
			suffix:'.min',
			extname:'.css'
		}))
		.pipe(gulp.dest(app.proPath+'css'));
		//.pipe(browserSync.stream());//浏览器的同步
});

//对js的合并 混淆 压缩
gulp.task('js',function(){
	gulp.src(app.srcPath+'js/**/*.js')
		.pipe($.plumber())
		.pipe($.concat(proName+'.js'))
		.pipe(gulp.dest(app.devPath+'js'))
		.pipe(gulp.dest(app.proPath+'js'))
		.pipe($.uglify())
		.pipe($.rename({
			suffix:".min",
			extname:".js"
		}))
		.pipe(gulp.dest(app.proPath+'js'))
		// .pipe(browserSync.stream());//浏览器的同步
});

//监视
gulp.task('watch',function(){
	gulp.watch(app.srcPath+'**/*.html',['html']);
	gulp.watch(app.srcPath+'less/**/*.less',['less']);
	gulp.watch(app.srcPath+'js/**/*.js',['js']);
});

//gulp-clean modal 用于清除指定路径中的所有文件夹
gulp.task('clean',function(){
	gulp.src(app.devPath,app.proPath)
		.pipe($.clean());
});

//gulp-imagemin 图片压缩
gulp.task('img',function(){
	gulp.src(app.srcPath+'image/**/*')//** 任务文件夹  * 任意文件
		.pipe($.plumber())
		.pipe($.imagemin())
		.pipe(gulp.dest(app.devPath+'image'))
		.pipe(gulp.dest(app.proPath+'image'));
});

//default任务是一个特殊的任务，是gulp默认启动任务
//数组参数指定:哪个任务被调用 需要去同步浏览器
gulp.task('default',['html','less','js','watch'],function(){
	browserSync.init({
		server:{
			baseDir:app.devPath
		}
	});
	//添加一个监视器，用于监视固定的文件变动
	//如果文件发生变化，执行browserSync组件的强制页面重载
	// gulp.watch(app.devPath+'css/**/*.css').on('change',browserSync.reload);
	
	//监听任何文件变化 实时刷新页面
	gulp.watch(app.devPath+'**/*.*').on('change',browserSync.reload);
});









































