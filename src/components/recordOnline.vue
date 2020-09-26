<template>
	<div class="record-page">
		<div v-show="!videoStart">
			<button class="btn btn-success mt-5" @click="startRecording">开始录制</button>
		</div>	
		<div v-show="videoStart">
			<p class="mt-2 display-3">正在录制</p>
			<Timer v-if="videoStart"></Timer>
			<button class="btn btn-danger" @click="stopRecording" id="btn-stop-recording">结束录制</button>
		</div>
		<!-- <video class="mt-5" v-show="flag" controls autoplay  ref="video" width="60%" height="60%"></video> -->
		<video class="mt-5" v-show="flag" controls autoplay  width="60%" height="60%">
		  <source ref="video"  type="video/mp4">
		  <source ref="video"  type="video/ogg">
		  您的浏览器不支持 HTML5 video 标签。
		</video>
	</div>
</template>
 
<script>
    import RecordRTC from 'recordrtc';
	import Timer from './Timer.vue'
	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap/dist/js/bootstrap.min.js';
	
    export default {
        name: "RecordOnline",
        data() {
            return {
				flag: false,
                video: null,
                videoStart: false,
                recorder: null,
            }
        },
		components:{
			// 注册组件
			Timer
		},
        created() {
			// 检测浏览器是否支持getDisplayMedia API
            if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
                let error = '你的浏览器不支持 getDisplayMedia API.';
                throw new Error(error);
            }
        },
        mounted() {
			// 获取video标签元素
            this.video = document.querySelector('video');
        },
        methods: {
			// 调用显示媒体
            invokeGetDisplayMedia(success, error) {
                let displaymediastreamconstraints = {
                    video: {
                        displaySurface: 'monitor', // monitor, window, application, browser
                        logicalSurface: true,
                        cursor: 'always' // never, always, motion
                    }
                };
                // above constraints are NOT supported YET
                // that's why overridnig them
                displaymediastreamconstraints = {
                    video: true
                };
                if (navigator.mediaDevices.getDisplayMedia) {
                    navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
                }
                else {
                    navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
                }
            },
			// 屏幕截图
            captureScreen(callback) {
                this.invokeGetDisplayMedia((screen) => {
                    this.addStreamStopListener(screen, () => {
                       //
                    });
                    callback(screen);
                }, function (error) {
                    console.error(error);
                    alert('无法捕获您的屏幕。请检查控制台日志.\n' + error);
                });
            },
            addStreamStopListener(stream, callback) {
                stream.addEventListener('ended', function () {
                    callback();
                    callback = function () { };
                }, false);
                stream.addEventListener('inactive', function () {
                    callback();
                    callback = function () { };
                }, false);
                stream.getTracks().forEach(function (track) {
					
                    track.addEventListener('ended', function () {
                        callback();
                        callback = function () { };
                    }, false);
					
                    track.addEventListener('inactive', function () {
                        callback();
                        callback = function () { };
                    }, false);
                });
            },
			// 开始录制
            startRecording() {
				this.flag = false;
                this.captureScreen(screen=>{
                    this.video.srcObject = screen;
                    this.recorder = RecordRTC(screen, {
                        type: 'video'
                    });
                    this.recorder.startRecording();
                    // 停止录制时释放屏幕
                    this.recorder.screen = screen;
                    this.videoStart = true;
                });
            },
            stopRecordingCallback() {
                this.video.src = this.video.srcObject = null;
                this.video.src = URL.createObjectURL(this.recorder.getBlob());
 
                this.recorder.screen.stop();
                this.recorder.destroy();
                this.recorder = null;
                this.videoStart = false;
				this.flag = true;
            },
			// 结束录制
            stopRecording() {
                this.recorder.stopRecording(this.stopRecordingCallback);
            }
        },
    }
</script>
 
<style lang="scss" scoped>
 
</style>