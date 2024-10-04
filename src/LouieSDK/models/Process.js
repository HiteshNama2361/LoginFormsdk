import data from "../raw/app.json";
const jsonData = data;

class Process {
  constructor(data) {
  this.action_intent = data.action_intent || null;
  this.is_explore_by_touch = data.is_explore_by_touch || false;
  this.node_to_process = data.node_to_process || null;
  this.second_node_to_process = data.second_node_to_process || null;
  this.third_node_to_process = data.third_node_to_process || null;
  this.global_command = data.global_command || false;
  this.node_value_type = data.node_value_type || "id";
  this.list_node = data.list_node || null;
  this.list_node_type = data.list_node_type || "id";
  this.root_node = data.root_node || null;
  this.root_node_value_type = data.root_node_value_type || "id";
  this.error_root_node = data.error_root_node || null;
  this.error_root_node_value_type = data.error_root_node_value_type || "id";
  this.action_id = data.action_id || 0;
  this.action_type = data.action_type || 0;
  this.parent_node = data.parent_node || null;
  this.parent_node_value_type = data.parent_node_value_type || "id";
  this.enable_log = data.enable_log || true;
  this.flag_for_checking_input_filter = data.flag_for_checking_input_filter || false;
  this.end_voice = data.end_voice || false;
  this.child_index = data.child_index || -1;
  this.focus_on_child = data.focus_on_child || false;
  this.check_list_ready = data.check_list_ready || false;
  this.next = data.next || null;
  this.second_next = data.second_next || null;
  this.third_next = data.third_next || null;
  this.secondary_next = data.secondary_next || null;
  this.error_next = data.error_next || null;
  this.second_error_next = data.second_error_next || null;
  this.third_error_next = data.third_error_next || null;
  this.selection_error_next = data.second_error_next || null;
  this.is_question = data.is_question || false;
  this.is_next_page = data.is_next_page || false;
  this.spoken_command = data.spoken_command || null;
  this.is_custom_action = data.is_custom_action || false;
  this.spoken_feedback= data.spoken_feedback || null;
  this.spoken_feedback_hi= data.spoken_feedback_hi || null;
  this.custom_feedback = data.custom_feedback || null;
  this.custom_error_feedback = data.custom_error_feedback || null
  this.error_node_to_process = data.error_node_to_process || null
  this.error_spoken_feedback = data.error_spoken_feedback || null
  this.error_node_value_type = data.error_node_value_type || "id";
  this.speech_mode = data.speech_mode || null;
  this.answers = data.answers || null;
  this.handleOnErrorCommands = data.handleOnErrorCommands || null;
  this.answers_feedback = data.answers_feedback || null
  this.feedback_to_announce = data.feedback_to_announce || "";
  this.screen = data.screen || null;
  this.optional_screen = data.optional_screen || null;
  this.optional_screen_next = data.optional_screen_next || null;
  this.primary_node = data.primary_node || null;
  this.secondary_node = data.secondary_node || "";
  this.extra_nodes = data.extra_nodes || "";
  this.draft_next = data.draft_next || null;
  this.is_global_action = data.is_global_action || false;
  this.is_spoken_feedback_necessary = data.is_spoken_feedback_necessary || false;
  this.found_text_next = data.found_text_next || null;
  this.found_append_next = data.found_append_next || null;
  this.read_more_next = data.read_more_next || null;
  this.start_command = data.start_command || null;
  this.screen_feedback_required = data.screen_feedback_required || false;
  this.delay_to_next = data.delay_to_next || 700;
  this.retry_wait_time = data.retry_wait_time || 200;
  this.process_flag = data.process_flag || -1;
  this.intent_match = data.intent_match || false;
  this.reset_process_flag = data.reset_process_flag || false;
  this.flag_next = data.flag_next || null;
  this.custom_flag_next = data.custom_flag_next || null;
  this.focus_saved_node = data.focus_saved_node || false;
  this.node_value_from_saved_text = data.node_value_from_saved_text || false;
  this.immediate_parent_class = data.immediate_parent_class || null;
  this.use_primary_command = data.use_primary_command || true;
  this.text_node = data.text_node || null;
  this.secondary_text_node = data.secondary_text_node || null;
  this.hide_keyboard = data.hide_keyboard || false;
  this.commands_only = data.commands_only || false;
  this.max_retry_count = data.max_retry_count || 6;
  this.has_copied_text_next = data.has_copied_text_next || null;
  this.paste_copied_text = data.paste_copied_text || false;
  this.notify_interval = data.notify_interval || -1;
  this.interval_feedback = data.interval_feedback || null;
  this.find_node_from_hover = data.find_node_from_hover || true;
  this.is_search_list = data.is_search_list || false;
  this.number_only = data.number_only || false;
  this.number_limit = data.number_limit || -1;
  this.cut_text = data.cut_text || false;
  this.append_with_type = data.append_with_type || 0;
  this.help_command = data.help_command || null;
  this.help_command_hi = data.help_command_hi || null;
  this.help_command_alternate = data.help_command_alternate || null;
  this.help_command_alternate_hi = data.help_command_alternate_hi || null;
  this.help_command_third = data.help_command_third || null;
  this.help_command_fourth =  data.help_command_fourth || null;
  this.enforce_cc = data.enforce_cc || false;
  this.break_commands = data.break_commands || null;
  this.reset_ccd = data.reset_ccd || false;
  this.visibility_required = data.visibility_required || false;
  this.traversal_type = data.traversal_type || 2;
  this.exact_text_match = data.exact_text_match || false;
  this.text_to_remove = data.text_to_remove || null;
  this.error_text_to_remove = data.error_text_to_remove || null
  this.text_remove_type = data.text_remove_type || 1
  this.nodes_to_read = data.nodes_to_read || null
  this.wait_for_event = data.wait_for_event || false
  this.allow_fast_command = data.allow_fast_command || false
  this.reset_flag = data.reset_flag || false
  this.isOverlay = data.isOverlay || false
  this.commandForOveraly = data.commandForOveraly || null
  this.need_portrait_mode = data.need_portrait_mode || false
  this.pre_screen = data.pre_screen || null
  this.block_two_finger_tap = data.block_two_finger_tap || false
  this.reset_volume = data.reset_values || false
  this.is_copy_txt = data.is_copy_txt || false
  this.is_list_reading= data.is_list_reading || false
  this.is_form_filling= data.is_form_filling || false
  this.read_more_max_count = data.read_more_max_count || null
  this.direct_search_command = data.direct_search_command || null

  // @Throws(CloneNotSupportedException::class)
  // public override fun clone(): Any {
  //     return super<Cloneable>.clone()
  // }

  
  this.audio_feedback = data.audio_feedback || false
  this.read_command_for_node = data.read_command_for_node || false
  this.reset_values = data.reset_values || false
  this.store_last_focused_feedback = data.store_last_focused_feedback || false
  this.remove_focus_from_overlay = data.remove_focus_from_overlay || false
  this.show_overlay = data.show_overlay || 0 
  this.open_mic_on_tap = data.open_mic_on_tap || false
  this.is_actionable = data.is_actionable || false
  this.action_intent = data.action_intent || null
  this.rewrite_last_append = data.rewrite_last_append || false
  this.rewrite_space_append = data.rewrite_space_append || false
  this.read_exist_message = data.read_exist_message || false
  this.speak_focused_message = data.speak_focused_message || true
  this.spoken_feedback_for_selected_message = data.spoken_feedback_for_selected_message || null
  this.is_normal_next = data.is_normal_next || false
  this.is_reverse_read = data.is_reverse_read || false
  this.is_message_search = data.is_message_search || false
  this.is_check_message_screen = data.is_check_message_screen || false
  this.is_home_command = data.is_home_command || false
  this.sound_file = data.sound_file || null
  this.reset_reading_mode = data.reset_reading_mode || false
  this.restrict_words = data.restrict_words || false
  this.list_readable_values = data.list_readable_values || null
  this.check_app_condition = data.check_app_condition || false
  this.stop_voice = data.stop_voice || false
  this.return_result_to_customer = data.return_result_to_customer || false
  this.already_selected_message = data.already_selected_message || null
  this.is_lang_eng = data.is_lang_eng || false
  this.feedback_name = data.feedback_name || "item"
  this.get_result_from_client = data.get_result_from_client || false
  this.exact_match_for_direct_search = data.exact_match_for_direct_search || 0
  this.list_node_values = data.list_node_values || null
  this.list_node_values_type = data.list_node_values_type || null
  this.comment = data.comment || null
  this.process_for_next_screen = data.process_for_next_screen || null
  this.on_interrupt_next = data.on_interrupt_next || null
}
}
console.log("*****", jsonData.processes);
const processMap = new Map();
for (const key in jsonData.processes) {
  const myObject = new Process(jsonData.processes[key]);
  processMap.set(key, myObject);
}
console.log("****123",processMap);
// export default {processMap};
export{processMap};
