export const validateName = (rule, value, callback) => {
	if (!value) {
		callback(new Error('请输入手机号'));
	} else {
		var phoneReg = /(^1[2-5789]\d{9}$)/;
		if(!phoneReg.test(value)){
			callback(new Error('输入的手机号格式不正确'));
		}
		callback();
		
	}
};
export const validatePsw = (rule, value, callback) => {
	if (!value) {
		callback(new Error('请输入密码'));
	} else {
		callback();
	}
};
export const validateCode = (rule, value, callback) => {
	if (!value) {
		callback(new Error('请输入验证码'));
	} else {
		var codeReg = /(\d{6}$)/;
		if(!codeReg.test(value)){
			callback(new Error('请输入6位数验证码'));
		}
		callback();
		
	}
};
