
$(document).ready(function () {

    function formatMoney(value) {
        return Number(value).toLocaleString("en-PK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Load last 10 calculations
    function loadHistory() {

        $.ajax({
            url: "/api/history",
            method: "GET",

            success: function (data) {

                $("#historyBody").empty();

                if (data.length === 0) {
                    $("#historyBody").html(
                        '<tr><td colspan="5" class="text-center">No history available</td></tr>'
                    );
                    return;
                }

                data.forEach(function (item) {

                    $("#historyBody").append(`
                        <tr>
                            <td>${formatMoney(item.principal)}</td>
                            <td>${item.rate}%</td>
                            <td>${item.months}</td>
                            <td>${formatMoney(item.emi)}</td>
                            <td>${$("<div>").text(item.servedBy).html()}</td>
                        </tr>
                    `);

                });

            },

            error: function () {
                $("#historyBody").html(
                    '<tr><td colspan="5">Unable to load history</td></tr>'
                );
            }
        });

    }

    // Submit EMI form using AJAX
    $("#emiForm").submit(function (event) {

        event.preventDefault();

        const P = Number($("#principal").val());
        const rate = Number($("#rate").val());
        const n = Number($("#months").val());

        $("#errorMessage").addClass("d-none");

        if (
            !Number.isFinite(P) ||
            !Number.isFinite(rate) ||
            !Number.isFinite(n) ||
            P <= 0 ||
            rate <= 0 ||
            n <= 0 ||
            !Number.isInteger(n)
        ) {
            $("#errorMessage")
                .text("Please enter positive values and whole months.")
                .removeClass("d-none");

            return;
        }

        $.ajax({

            url: "/api/emi",
            method: "POST",
            contentType: "application/json",

            data: JSON.stringify({
                P: P,
                rate: rate,
                n: n
            }),

            success: function (data) {

                $("#emi").text(formatMoney(data.emi));
                $("#totalPayment").text(formatMoney(data.totalPayment));
                $("#totalInterest").text(formatMoney(data.totalInterest));
                $("#servedBy").text(data.podName);
                $("#podIp").text(data.podIp);

                $("#result").removeClass("d-none");

                loadHistory();
            },

            error: function (xhr) {

                const message = xhr.responseJSON?.error ||
                    "Something went wrong.";

                $("#errorMessage")
                    .text(message)
                    .removeClass("d-none");
            }

        });

    });

    loadHistory();

});
