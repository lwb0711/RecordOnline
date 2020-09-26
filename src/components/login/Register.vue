<template>
	<div class="container">
		<p class="h3">欢迎注册</p>
		<div>
			<span>已有账号? </span>
			<router-link to="/login">登录</router-link>
			<router-view></router-view>
		</div>
		
		<div class="row mt-2">
			<!-- 账号 -->
			<div class="col-4"></div>
			<div class="col-4">
				<div class="input-group mb-2">
					<div class="input-group-prepend">
						<span class="input-group-text"><i class="iconfont user mr-1"></i></span>
					</div>
					<input type="text" @focus="clean" class="form-control" autofocus placeholder="请输入账号" v-model="username">
				</div>
			</div>
			<div class="col-4"></div>
			
			<!-- 密码 -->
			<div class="col-4"></div>
			<div class="col-4">
				<div class="input-group mb-2">
					<div class="input-group-prepend">
						<span class="input-group-text"><i class="iconfont mima mr-1"></i></span>
					</div>
					<input type="password" @focus="clean" class="form-control" placeholder="请输入密码" v-model="password">
				</div>
			</div>
			<div class="col-4"></div>
			
			<!-- 确认密码 -->
			<div class="col-4"></div>
			<div class="col-4">
				<div class="input-group mb-2">
					<div class="input-group-prepend">
						<span class="input-group-text"><i class="iconfont mima mr-1"></i></span>
					</div>
					<input type="password" @focus="clean" class="form-control" placeholder="再次输入密码" v-model="repassword">
				</div>
			</div>
			<div class="col-4"></div>
			
			<!-- 手机号码 -->
			<div class="col-4"></div>
			<div class="col-4">
				<div class="input-group mb-2">
					<div class="input-group-prepend">
						<span class="input-group-text"><i class="iconfont shouji mr-1"></i></span>
					</div>
					<input type="text" @focus="clean" class="form-control" placeholder="输入手机号" v-model="phone">
				</div>
			</div>
			<div class="col-4"></div>
			
			<!-- 验证码 -->
			<div class="col-4"></div>
			<div class="col-4">
				<div class="input-group mb-2">
					<div class="input-group-prepend">
						<span class="input-group-text"><i class="iconfont yanzhengma mr-1"></i></span>
					</div>
					<input type="text" class="form-control" @focus="clean" v-model="captcha" required placeholder="请输入验证码">
					<div class="input-group-append">
						<button class="btn btn-outline-secondary" type="button" v-show="verShow" @click="handleCapacha">获取验证码</button>
						<button class="btn btn-outline-secondary" type="button" v-show="!verShow"><span>{{timer}}</span>s后重新获取</button>
					</div>
				</div>
			</div>
			<div class="col-4"></div>
			
			<!-- 错误提示 -->
			<div class="col-4"></div>
			<div class="col-4">
				<label class="errorMsg" v-cloak >{{ errorMsg }}</label>
			</div>
			<div class="col-4"></div>
			
			<div class="col-4"></div>
			<div class="col-4">
				<input type="checkbox" checked @click = "checkbox"/>
				<a target="_blank" href="./clause.html">我已阅读并同意所有条款</a>
			</div>
			<div class="col-4"></div>
			
			<div class="col-5 mt-2"></div>
			<div class="col-2 mt-2">
				<button type="button" class="btn btn-success btn-block" :disabled = "!dis" @click="register">立即注册</button>
			</div>
			<div class="col-5 mt-2"></div>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery';
	
	export default {
		name:'register',
		data() {
			return {
				dis: true,
				verShow: true,
				captcha: '',
				errorMsg: '',
				timer: '',
				username: '',
				phone:'',
				password: '',
				repassword: ''
			}
		},
		methods: {
			checkbox() {
				this.dis = event.target.checked
			},
			clean() {
				this.errorMsg = ''
			},
			// 获取验证码
			handleCapacha() {
				if(this.phone.length) {
					if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone))){ 
						this.errorMsg = '请输入正确的手机号'
					}else {
						this.errorMsg = '验证码发送成功，请注意查收'
						this.timer = 60	;
						this.verShow = false;
						var auth_timer = setInterval(()=>{
							this.timer--;
							if(this.timer<=0){
								this.verShow = true;
								clearInterval(auth_timer)
							}
						},1000)
					} 
				}else {
					this.errorMsg = '请输入手机号码'
				}
			},
			register() {
				if(!this.username) {
					this.errorMsg = '请输入账号'
				}else if(!this.password || !this.repassword) {
					this.errorMsg = '请输入密码'
				}else if(!this.captcha) {
					this.errorMsg = '请输入验证码'
				}else if(!this.phone) {
					this.errorMsg = '请输入手机号码'
				}else if(this.password!=this.repassword){
					this.errorMsg = '密码不一致'
				}else if(this.password.length<6){
					this.errorMsg = '密码长度至少6位'
				}else {
					var thisvue = this;
					$.ajax({
						type: 'post',
						url: 'http://118.89.238.34/php/register.php',
						data: {
							username: thisvue.username,
							password: thisvue.password,
							phone: thisvue.phone,
							captcha: thisvue.captcha
						},
						success: function(res){
							if(res[0].msg=='username'){
								thisvue.errorMsg = '该账号名已经被注册'
							}else if(res[0].msg=='phone'){
								thisvue.errorMsg = '该手机号已经被注册'
							}else if(res[0].msg=='captcha'){
								thisvue.errorMsg = '验证码错误'
							}else {
								alert('注册成功，请登录')
								thisvue.$router.push('/login')
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		margin-top: 10px;
		.row {
			.input-group-prepend {
				.input-group-text {
					background-color: #f3f3f3;
					border-radius: 7px;
				}
			}
			.form-control {
				border-radius: 7px;
			}
			input[type=checkbox] {
				zoom:120%;
				margin-right: 5px;
			}
			
			a {
				text-decoration: none;
			}
			.errorMsg {
				color: red;
			}
		}
		
	}
</style>
