namespace WebApplication1.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }

        public required string Message { get; set; }

        public T? Data { get; set; }

        public static ApiResponse<T> Ok(T data, string? msg = null) =>
            new() { Success = true, Message = msg ?? "Success", Data = data };

        public static ApiResponse<T> Fail(string msg) =>
            new() { Success = false, Message = msg, Data = default };
    }
}
