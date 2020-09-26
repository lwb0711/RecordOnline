<template>
	<div id="app">
		<!-- 导航栏 -->
		<nav class="navbar navbar-expand navbar-light bg-light">
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<a class="nav-link" @click="home">首页<span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="javascript:alert('敬请期待')">使用教程</a>
					</li>
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						关于我们
						</a>
						<div class="dropdown-menu" aria-labelledby="navbarDropdown">
							<a class="dropdown-item" href="javascript:alert('敬请期待')">砺云导航3-1</a>
							<a class="dropdown-item" href="javascript:alert('敬请期待')">砺云导航3-2</a>
							<a class="dropdown-item" href="javascript:alert('敬请期待')">砺云导航3-3</a>
						</div>
			  </li>
			</ul>
			<!-- 	<form class="form-inline my-2 my-lg-0">
					<input class="form-control mr-sm-2" type="search" placeholder="搜索" aria-label="Search">
				</form> -->
				<div class="collapse navbar-collapse" v-if="!islogin">
					<button class="btn btn-danger ml-auto my-2 mr-3 my-sm-0 login" @click="login">登录</button>
				</div>
				<!-- <router-link to="/login"><button class="btn btn-success my-2 mr-3 my-sm-0">登录</button></router-link>
				</router-view> -->
			
				<div class="collapse navbar-collapse ml-auto" v-else id="navbarSupportedContent">
					<ul class="navbar-nav ml-auto">
						<li class="nav-item dropdown">
							<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown1"
								role="button" data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false"
							><img src="./assets/img/user.jpg" class="rounded-circle mr-1" width="23px">{{user}}</a>
							<div class="dropdown-menu ml-auto" aria-labelledby="navbarDropdown1">
								<a class="btn dropdown-item"><i class="iconfont gerenxinxi mr-2"></i>个人信息</a>
								<a class="btn dropdown-item"><i class="iconfont wenjianguanli mr-2"></i>文件管理</a>
								<a class="btn dropdown-item" @click="logout"><i class="iconfont tuichu mr-2"></i>退出</a>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		
		<router-view/>
	</div>
</template>

<script>
	import $ from 'jquery';
	
	export default{
		// 防止vuex的state数据丢失
		created () {
		    //在页面加载时读取sessionStorage里的状态信息
		    if (sessionStorage.getItem("store") ) {
		        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
		    } 
		
		    //在页面刷新时将vuex里的信息保存到sessionStorage里
		    window.addEventListener("beforeunload",()=>{
		        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
		    })
		  },
		computed: {
			islogin() {
				return this.$store.state.islogin
			},
			user() {
				return this.$store.state.user
			}
		},
		methods: {
			// 路由跳转
			home() {
				this.$router.push(
					{path:'/'},
					onComplete => {},
					onAbort => {}
				)
			},
			login() {
				this.$router.push(
					{path: '/login'},
					onComplete => {},
					onAbort => {}
				)
			},
			// 退出登录
			logout() {
				var thisvue = this;
				$.ajax({
					type:'post',
					url:'http://118.89.238.34/php/logout.php',
					data:{
						username:thisvue.$store.state.user
					},
					success:function(res){
						// console.log(res);
						thisvue.$store.commit('updateIsLogin',false);
						thisvue.$store.commit('user','');
					}
				})
			}
		}
	}
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	
	#nav {
	  padding: 30px;
	}
	
	&a {
		font-weight: bold;
		color: #2c3e50;
		
		&:first-child {
			cursor: pointer;
		}
	}
	
	.dropdown:hover>.dropdown-menu {
		display: block;
	}
	.dropdown>.dropdown-toggle:active {
		pointer-events: none;
	}
	.dropdown-menu {
		.btn {
			padding: 2px;
		}
		.dropdown-item:hover {
			background-color: #cccccc;
		}
	}
}
</style>
