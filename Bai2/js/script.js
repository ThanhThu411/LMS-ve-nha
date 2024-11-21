$(function () {
    // Khai báo các object
    var container = $('#container');
    var bird = $('#bird');
    var pole = $('.pole');
    var pole_1 = $('#pole_1');
    var pole_2 = $('#pole_2');
    var score = $('#score');
    var levelDisplay = $('#level');
    var scoreSound = new Audio('audio/score.mp3'); // Âm thanh khi ghi điểm (d & e)

    // Chuyển các thông tin của object sang dạng số thực
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var pole_initial_position = parseInt(pole.css('right'));
    var pole_initial_height = parseInt(pole.css('height'));
    var bird_left = parseInt(bird.css('left'));
    var bird_height = parseInt(bird.height());
    var speed = 10; 
    var interval = 40; // Default interval
    var level = 1; // Start at level 1

    // Một số trạng thái trong game
    var go_up = false;
    var score_updated = false;
    var game_over = false;

    // Hàm cập nhật level
    function updateLevel() {
        if (parseInt(score.text()) >= 50) {
            stop_the_game(); // Stop the game and show win
            alert("You win!");
        } else if (parseInt(score.text()) >= 40) {
            level = 4;
            interval = 20;
            speed = 15; // Increase speed
        } else if (parseInt(score.text()) >= 20) {
            level = 3;
            interval = 25;
            speed = 12; // Increase speed
        } else if (parseInt(score.text()) >= 5) {
            level = 2;
            interval = 30;
            speed = 10; // Increase speed
        }
        levelDisplay.text("Level: " + level);
    }

    // Hàm bắt đầu game
    function playGame() {
        // Realtime cho game 
        var the_game = setInterval(function () {
            if (collision(bird, pole_1) || // Nếu chú chim va chạm với ống trên
                collision(bird, pole_2) || // Hoặc chú chim va chạm với ông dưới
                parseInt(bird.css('top')) <= 0 || // Hoặc chú chim va chạp với khung game trên
                parseInt(bird.css('top')) > container_height - bird_height // Hoặc chú chim va chạm với khung game dưới
                )
            {
                stop_the_game(); // Chạy hàm thua game
            }
            else
            {
                // Lấy vị trị hiện tại của ống nước
                var pole_current_position = parseInt(pole.css('right'));
                // Cập nhập điểm khi chú chim vượt qua 1 cặp ống
                if (pole_current_position > container_width - bird_left)
                {
                    if (score_updated === false)
                    {
                        score.text(parseInt(score.text()) + 1); // Cộng 1 điểm
                        score_updated = true;
                        scoreSound.play(); // Play scoring sound
                        updateLevel(); // Update level when score changes
                    }
                }

                // Kiểm tra các ống đã đi ra khỏi khung game 
                if (pole_current_position > container_width) {
                    var new_height = parseInt(Math.random() * 100); 
                    // Tạo chiều cao các ống nước ngẫu nhiên
                    pole_1.css('height', pole_initial_height + new_height);
                    pole_2.css('height', pole_initial_height - new_height);
                    score_updated = false;
                    pole_current_position = pole_initial_position; // Gán vị trị hiện tại = vị trí ban đầu của ống nước
                }

                // Di chuyển ống nước
                pole.css('right', pole_current_position + speed);

                // Nếu không điều khiển chú chim bay lên
                if (go_up === false) {
                    go_down(); // Hàm di chuyển chú chim rơi xuống
                }
            }
        }, interval);
    }
    

    // Khi nhả chuột ra trong khung game
    $('#container').mouseup(function (e) {    
        clearInterval(go_up); // Xoá realtime hành động bay lên cho chú chim
        go_up = false;
    });

    // Khi nhấp chuột vào trong khung game
    $('#container').mousedown(function (e) {
        go_up = setInterval(up, 40); // Realtime hành động bay lên cho chú chim
    });

    // Thêm sự kiện keydown cho phím mũi tên xuống
    $(document).keydown(function(e) {
        if (e.key === "ArrowDown") { // Kiểm tra nếu phím mũi tên xuống được nhấn
            go_down(); // Gọi hàm cho chim rơi xuống
        } else if (e.key === "ArrowUp") { // Kiểm tra nếu phím mũi tên lên được nhấn
            go_up = setInterval(up, 40); // Gọi hàm cho chim bay lên
        }
    });

    // Thêm sự kiện keyup cho phím mũi tên lên
    $(document).keyup(function(e) {
        if (e.key === "ArrowUp") { // Kiểm tra nếu phím mũi tên lên được nhả ra
            clearInterval(go_up); // Dừng hành động bay lên
            go_up = false; // Đặt trạng thái go_up về false
        }
    });

    // Khi nhấn vào Chơi game
    $('#play_btn').click(function() {
         playGame(); // Chạy hàm bắt đầu chơi game
         $(this).hide(); // Ẩn nút chơi game
    });    

    // Hàm di chuyển chú chim rơi xuống
    function go_down() {
        bird.css('top', parseInt(bird.css('top')) + 10);
        bird.css('transform', 'rotate(50deg)'); // Nghiêng object chú chim 50 độ
    }

    // Hàm di chuyển chú chim bay lên
    function up() {
        bird.css('top', parseInt(bird.css('top')) - 20);
        bird.css('transform', 'rotate(-10deg)'); // Nghiêng object chú chim -10 độ
    }

    // Hàm thua game
    function stop_the_game() {
        clearInterval(playGame()); // Xoá realtime chơi game
        game_over = true;
        

        // Thêm hiệu ứng khi thua game (d & e))
        // Thêm lớp spin vào chim
        bird.addClass('spin');
    
        $('#restart_btn').slideDown(); // Hiện nút chơi lại
        // Hiệu ứng rơi xuống
        bird.animate({ top: '+=500', opacity: 0 }, 1000, function() {
            bird.removeClass('spin');
            bird.css('opacity', 1); 
        });
    }
    // Khi click vào nút Chơi lại
    $('#restart_btn').click(function () {
        location.reload(); // Tải lại trang
    });

    // Hàm va chạm giữa 2 object
    function collision($div1, $div2) {
        // Khai báo các thông số của 2 object
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        // Nếu xảy ra va chạm
        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
            return false;
        }
        // Ngược lại không va chạm
        else
        {
            return true;
        }
    }
});