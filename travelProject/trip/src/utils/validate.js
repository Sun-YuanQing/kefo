/**
 * Created by LH on 19/11/08.
 */
export const validatePhone = (rule, value, callback) => {
	var phoneReg = /(^1[3-9]\d{9}$)/;
	if (value === '') {
	   callback(new Error('请输入手机号!'));
	} else if(!phoneReg.test(value)){
		callback(new Error('输入的手机号格式不正确!'));
	}else{
		callback();
	}

};

export const validatePwd = (rule, value, callback) => {
		let pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$)[0-9A-Za-z]{6,16}$/;
		if (value === '') {
			callback(new Error('请输入密码!'));
		} else if(!pwdReg.test(value)){
			callback(new Error('密码为6-16位数字、字母组合!'));
		}else{
			callback();
		}
	
};
    
export const validateCode = (rule, value, callback) => {
		let codeReg = /^\d{6}$/;
		if (value === '') {
			callback(new Error('请输入验证码!'));
		} else if(!codeReg.test(value)){
			callback(new Error('验证码为6位数字!'));
		}else{
			callback();
		}
	
};

export const validateCardId = (rule, value, callback) => {
	var cardReg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])|([1−9]\d5\d2((0[1−9])|(10|11|12))(([0−2][1−9])|10|20|30|31)\d2[0−9Xx])/;
	if (value === '') {
		callback(new Error('请输入身份证号'));
	} else if(!cardReg.test(value)){
		callback(new Error('输入的身份证号格式不正确!'));
	}else{
		callback();
	}
	
};

export const validateEmail = (rule, value, callback) => {
		var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		if (value === '') {
			callback(new Error('请输入邮箱'));
		} else if(!mailReg.test(value)){
			callback(new Error('输入的邮箱格式不正确!'));
		}else{
			callback();
		}
        
};
    
/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
