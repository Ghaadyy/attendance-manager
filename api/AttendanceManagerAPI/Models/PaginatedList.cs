using System;
namespace AttendanceManagerAPI.Models;

/// <summary>
/// A list that supports pagination, generic of type T.
/// </summary>
/// <typeparam name="T"></typeparam>
[Serializable]
public class PaginatedList<T>
{
    public required List<T> List { get; set; }
    public required bool HasMore { get; set; }
}