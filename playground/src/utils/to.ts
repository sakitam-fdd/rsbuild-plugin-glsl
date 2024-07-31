/**
 * 针对await的错误处理 (错误优先原则)
 * 示例：
 *
 * ```js
 *  [ err, user ] = await to(UserModel.findById(1));
 * ```
 * @param { Promise } promise
 * @param { Object= } errorExt - 添加外部的错误信息信息，这个可以与当前错误信息合并
 * @return { Promise }
 */
export function to<T, U = Error>(promise: Promise<T>, errorExt?: object): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = { ...err, ...errorExt };
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

export default to;
