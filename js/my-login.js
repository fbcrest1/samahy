function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username === "FbCrest" && password === "Nguyentankhanghy12") {
        return true;
    } else {
        alert("Tài khoản hoặc mật khẩu không chính xác!");
        return false;
    }
}
