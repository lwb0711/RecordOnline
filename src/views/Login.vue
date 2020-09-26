<template>
	<div class="container">
		<form method="post">
			<div class="row">
				<!-- 模式切换 -->
				<div class="col-4"></div>				
				<div class="col-2" @click="zhanghao">
					<button class="btn" :class="{'tabbar':flag}" type="button">账号</button>
				</div>				
				<div class="col-2" @click="shoujihao">
					<button class="btn" :class="{'tabbar':!flag}" type="button">免密登录</button>
				</div>				
				<div class="col-4"></div>
			</div>
			
			<div class="row" v-show="flag">
				<!-- 账号-->
				<div class="col-4"></div>
				<div class="col-4">
					<p class="tip">账号</p>
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text">
								<i class="iconfont user"></i>
							</span>
						</div>
						<input type="text" class="form-control" autofocus v-model="username" @focus="clean" required placeholder="请输入账号" name="username">
					</div>
				</div>
				<div class="col-4"></div>
				
				<!-- 密码 -->
				<div class="col-4"></div>
				<div class="col-4">
					<p class="tip">密码</p>
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text"><i class="iconfont mima mr-1"></i></span>
						</div>
						<input type="password" class="form-control" v-model="password" @focus="clean" name="password" required placeholder="请输入密码">
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
				<div class="col-2">
					<router-link to="/register">新用户注册</router-link>
					<router-view></router-view>
				</div>
				<div class="col-2">
					<router-link to="/forgotPassword">忘记密码?</router-link>
					<router-view></router-view>
				</div>
				<div class="col-4"></div>
				
				<!-- 账号登录 -->
				<div class="col-4"></div>
				<div class="col-4">
					<button class="btn btn-success" type="button" @click="usernameLogin">登录</button>
				</div>
				<div class="col-4"></div>
			</div>
			
			<div class="row" v-show="!flag">
				<!-- 手机-->
				<div class="col-4"></div>
				<div class="col-4">
					<p class="tip">手机</p>
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text">
								<i class="iconfont shouji"></i>
							</span>
						</div>
						<input type="text" autofocus class="form-control" v-model="phone" @focus="clean" required placeholder="请输入手机号码" name="phone">
					</div>
				</div>
				<div class="col-4"></div>
				
				<!-- 验证码 -->
				<div class="col-4"></div>
				<div class="col-4">
					<p class="tip">验证码</p>
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text"><i class="iconfont yanzhengma mr-1"></i></span>
						</div>
						<input type="text" class="form-control" v-model="captcha" name="captcha" required placeholder="请输入验证码">
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
				
				
				<!-- 手机登录 -->
				<div class="col-4"></div>
				<div class="col-4">
					<button class="btn btn-success" type="button" @click="phoneLogin">登录</button>
				</div>
				<div class="col-4"></div>
			</div>
		</form>
	</div>
</template>

<script>
import $ from 'jquery'
	
export default {
	name:'login',
	data() {
		return {
			flag:true,
			username: '',
			password: '',
			phone: '',
			captcha: '',
			timer: '',
			errorMsg: '',
			verShow: true
		}
	},
	methods:{
		// 清除错误提示
		clean() {
			return this.errorMsg=''
		},
		// 用户登录
		usernameLogin(){
			if(this.username=='') {
				this.errorMsg = '请输入用户名';
			}else if(this.password=='') {
				this.errorMsg = '请输入密码';
			}else {
				// 保存this对象
				var thisvue = this;
				// 用ajax方式请求
				$.ajax({
					type:'POST',
					url:'http://118.89.238.34/php/login.php',
					data:{
						username:thisvue.username,
						password:thisvue.password
					},
					success:function(res){
						if(res[0].code==200)
						{
							thisvue.errorFlag = false;
							thisvue.$store.commit('updateIsLogin',true);
							thisvue.$store.commit('user',res[0].username);
							thisvue.$router.push('/')
							// console.log(res)
						}
						else{
							thisvue.errorMsg = '账号或密码错误';
							thisvue.password = '';
							// console.log(res);
						}
					}
				})

			}
		},
		// 手机免密登录
		phoneLogin() {
			if(this.phone=='') {
				this.errorMsg = '请输入手机号'
			}else if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone))) {
				this.errorMsg = '请输入正确的手机号'
			}else if(this.captcha=='') {
				this.errorMsg = '请输入验证码'
			}else {
				// 保存this对象
				var thisvue = this;
				
				// 用aios请求出错，不会排除
				// axios({
				// 	method: 'post',
				// 	// 模拟接口
				// 	url: 'http://118.89.238.34/php/phoneTest.php',
				// 	data: {
				// 		phone: thisvue.phone
				// 	}
				// })
				// .then(function (res) {
				// 	console.log(11);
				// })
				// .catch(function (error) {
				// 	console.log(error);
				// });
				
				$.ajax({
					type:'post',
					url:'http://118.89.238.34/php/phoneTest.php',
					data:{
						phone: thisvue.phone
					},
					success:function(res){
						// console.log(res)
						if(res[0].captcha==thisvue.captcha) {
							thisvue.errorFlag = false;
							thisvue.$store.commit('updateIsLogin',true);
							thisvue.$store.commit('user',res[0].username);
							thisvue.$router.push('/')
						}else if(res[0].captcha==404){
							thisvue.errorMsg = '该手机号未被注册';
						}else {
							thisvue.errorMsg = '验证码错误';
						}
						thisvue.captcha = '';
					}
				})
			}
		},
		
		// 账号
		zhanghao() {
			this.errorMsg = '';
			this.flag = true
		},
		// 手机号
		shoujihao() {
			this.errorMsg = '';
			this.flag = false
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
		}
	}
}
</script>

<style lang="scss" scoped>
	.container {
		/* background: url(../assets/bg.jpg) no-repeat fixed center;
		background-size: 100% 100%;
		height: 100%;
		position: fixed;
		width: 100% */
		.row {
			&:first-child {
				margin-top: 70px;
			}
			
			.tabbar {
				background-color: #5cb0ff;
				transition: 0.6s;
			}
			
			.col-4 {
				.tip {
					text-align: left;
				}
				.errorMsg {
					color: red;
				}
			}
			.col-2 {
				a {
						 text-decoration: none;
				}
			}
			.btn:hover,.btn:focus {
			     outline: none;
			}
		}
	}
</style>
