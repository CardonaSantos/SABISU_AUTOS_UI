// api/utils.ts
export const cleanParams = <T extends object>(o?: T) =>
  o
    ? Object.fromEntries(
        Object.entries(o).filter(
          ([, v]) => v !== undefined && v !== null && v !== ""
        )
      )
    : undefined;
