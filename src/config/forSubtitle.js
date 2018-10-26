const subtitle = (item, isNurseFlag) => {
  return `${item.confirmation_code} | ${item.start_date} ${item.start_time}` +
    `${ (item.nurse_id !== null && item.is_complete_by_nurse !== true) ? ' | Accepted' : '' }` +
    `${ (item.nurse_id !== null && item.is_complete_by_nurse === true) ? ' | Completed' : '' }` +
    `${ (item.nurse_id === null && item.refunded !== true) ? ' | Pending' : '' }` +
    `${ (item.refunded === true) ? ' | Refunded' : '' }`;
}

export default subtitle;
