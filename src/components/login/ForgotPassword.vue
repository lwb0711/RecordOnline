<template>
	<div class="container mt-5">
		<div class="h3 mb-5">重置密码</div>
		<div class="row">
			
			<!-- 手机号码 -->
			<div class="col-4"></div>
			<div class="col-4">
				<div class="input-group mb-3">
					<div class="input-group-prepend">
						<span class="input-group-text"><i class="iconfont shouji mr-1"></i></span>
					</div>
					<input type="text" autofocus class="form-control" @focus="clean" v-model="phone" placeholder="输入手机号">
				</div>
			</div>
			<div class="col-4"></div>
			
			<!-- 验证码 -->
			<div class="col-4"></div>
			<div class="col-4">
				<div class="input-group mb-3">
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
			
			<!-- 密码 -->
			<div class="col-4"></div>
			<div class="col-4">
				<div class="input-group mb-3">
					<div class="input-group-prepend">
						<span class="input-group-text"><i class="iconfont mima mr-1"></i></span>
					</div>
					<input type="password" class="form-control" @focus="clean" placeholder="请输入密码" name="password">
				</div>
			</div>
			<div class="col-4"></div>
			
			<!-- 确认密码 -->
			<div class="col-4"></div>
			<div class="col-4">
				<div class="input-group mb-3">
					<div class="input-group-prepend">
						<span class="input-group-text"><i class="iconfont mima mr-1"></i></span>
					</div>
					<input type="password" class="form-control" @focus="clean" placeholder="再次输入密码" name="repassword">
				</div>
			</div>
			<div class="col-4"></div>
			
			<!-- 错误提示 -->
			<div class="col-4"></div>
			<div class="col-4">
				<label class="errorMsg" v-cloak >{{ errorMsg }}</label>
			</div>
			<div class="col-4"></div>
			
			<div class="col-5"></div>
			<div class="col-2">
				<button class="btn btn-success btn-block" @click="updatePassword">确认</button>
			</div>
			<div class="col-5"></div>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery';
	
	export default {
		data() {
			return {
				verShow: true,
				phone: '',
				captcha: '',
				timer: '',
				errorMsg: ''
			}
		},
		methods: {
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
			 
			// 更改密码
			updatePassword() {
				if(!this.phone.length) {
					this.errorMsg = '请输入手机号'
				}else if(this.captcha==''){
					this.errorMsg = '请输入验证码'
				}else if($( "input[name='password']")[0].value == '') {
					this.errorMsg = '请输入密码'
				}else if($( "input[name='password']")[0].value != $( "input[name='repassword']")[0].value){
					this.errorMsg = '密码不一致'
				}else if($( "input[name='password']")[0].value.length<6) {
					this.errorMsg = '密码至少要6位长度，修改失败'
				}else {
					var thisvue = this;
					$.ajax({
						type: 'post',
						url: 'http://118.89.238.34/php/changePassword.php',
						data: {
							phone: thisvue.phone,
							captcha: thisvue.captcha,
							password: $( "input[name='password']")[0].value
						},
						success: function(res) {
							console.log(res)
							if(res[0].msg=='captcha') {
								this.errorMsg = '验证码错误'
							}else if(res[0].msg=='phone') {
								this.errorMsg = '该手机号码未注册'
							}else {
								alert('密码修改成功,请登录');
								thisvue.$router.push('/login')
							}
						}
					})
				}
			},
			
			// 清除错误提示
			clean() {
				this.errorMsg = ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.row {
			.col-4 {
				.errorMsg {
					color: red;
				}
			}
		}
	}
</style>
