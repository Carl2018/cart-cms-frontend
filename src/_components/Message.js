import { message } from 'antd';

export function success(codeString) {
	switch (codeString) {
		case "create_success":
			message.success("a record has been created successfully");
		break;
		case "edit_success":
			message.success("a record has been edited successfully");
		break;
		case "delete_success":
			message.success("a record has been deleted successfully");
		break;
		case "batch_delete_success":
			message.success("multiple records have been deleted successfully");
		break;
		default:
			message.success("unknown success");
		break;
	}
}

export function cancel(codeString) {
	switch (codeString) {
		case "create_cancel":
			message.info("create has been canceled");
		break;
		case "edit_cancel":
			message.info("edit has been canceled");
		break;
		case "delete_cancel":
			message.info("delete has been canceled");
		break;
		case "batch_delete_cancel":
			message.info("batch delete has been canceled");
		break;
		default:
			message.info("unknown cancel");
		break;
	}
}

export function refresh(codeString) {
	switch (codeString) {
		case "table_refresh":
			message.success("the table has been refreshed");
		break;
		default:
			message.success("unknown refresh");
		break;
	}
}

