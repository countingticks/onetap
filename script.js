UI.AddSubTab(["Rage", "SUBTAB_MGR"], "Delusion");
UI.AddSubTab(["Rage", "SUBTAB_MGR"], "      Anti-Aim");
UI.AddSubTab(["Rage", "SUBTAB_MGR"], "      Visual");
UI.AddSubTab(["Rage", "SUBTAB_MGR"], "      Misc");

const menu_handle = {};
const helper = {};
const freestand = {};
const antiaim = {};
const anti_bruteforce = {};
const font = {};
const color = {};
const animation = {};
const draw = {};

// MENU
menu_handle.elements = {};
menu_handle.elements["antiaim"] = {};
menu_handle.elements["antiaim"]["general"] = {};
menu_handle.elements["antiaim"]["builder"] = {};
menu_handle.elements["antiaim"]["anti-bruteforce"] = {};
menu_handle.elements["visuals"] = {};

menu_handle.AddCheckbox = function(path, name) 
{
    return UI.AddCheckbox(path, name);
};

menu_handle.AddDropdown = function(path, name, elements, search) 
{
    return UI.AddDropdown(path, name, elements, search);
};

menu_handle.AddMultiDropdown = function(path, name, elements) 
{
    return UI.AddMultiDropdown(path, name, elements);
};

menu_handle.AddSliderInt = function(path, name, min, max) 
{
    return UI.AddSliderInt(path, name, min, max);
};

menu_handle.AddSliderFloat = function(path, name, min, max) 
{
    return UI.AddSliderFloat(path, name, min, max);
};

menu_handle.AddColorPicker = function(path, name) 
{
    return UI.AddColorPicker(path, name);
};

menu_handle.create = function()
{
    // ANTI AIM
    // BUILDER
    const states = ["Shared", "Stand", "Walk", "Slow", "Crouch", "Air"];

    menu_handle.elements["antiaim"]["main"] = menu_handle.AddDropdown(["Rage", "      Anti-Aim", "      Anti-Aim"], "Controller", ["General","Builder", "Anti-Bruteforce"], 0);
    menu_handle.elements["antiaim"]["builder"]["states"] = menu_handle.AddDropdown(["Rage", "      Anti-Aim", "      Anti-Aim"], "Condition", states, 0);
    
    for (var i = 0; i < states.length; i++)
    {
        if (states[i] != "Shared")
        {
            menu_handle.elements["antiaim"]["builder"]["enable_" + states[i].toLowerCase()] = menu_handle.AddCheckbox(["Rage", "      Anti-Aim", "      Anti-Aim"], "Enable " + states[i]);
        }

        menu_handle.elements["antiaim"]["builder"]["right_yaw_" + states[i].toLowerCase()] = menu_handle.AddSliderInt(["Rage", "      Anti-Aim", "      Anti-Aim"], "[ " + states[i] +" - Right ]  Yaw", -180, 180);
        menu_handle.elements["antiaim"]["builder"]["left_yaw_" + states[i].toLowerCase()] = menu_handle.AddSliderInt(["Rage", "      Anti-Aim", "      Anti-Aim"], "[ " + states[i] +" - Left ]  Yaw", -180, 180);
        menu_handle.elements["antiaim"]["builder"]["jitter_yaw_" + states[i].toLowerCase()] = menu_handle.AddDropdown(["Rage", "      Anti-Aim", "      Anti-Aim"], "[ " + states[i] +" ]  Jitter Yaw", ["Off", "Offset", "Synced"], 0);
        menu_handle.elements["antiaim"]["builder"]["jitter_yaw_value_" + states[i].toLowerCase()] = menu_handle.AddSliderInt(["Rage", "      Anti-Aim", "      Anti-Aim"], "[ " + states[i] +" ]  Jitter Value", -180, 180);
        menu_handle.elements["antiaim"]["builder"]["right_fake_" + states[i].toLowerCase()] = menu_handle.AddSliderInt(["Rage", "      Anti-Aim", "      Anti-Aim"], "[ " + states[i] +" - Right ]  Fake", 0, 60);
        menu_handle.elements["antiaim"]["builder"]["left_fake_" + states[i].toLowerCase()] = menu_handle.AddSliderInt(["Rage", "      Anti-Aim", "      Anti-Aim"], "[ " + states[i] +" - Left ]  Fake", 0, 60);
        menu_handle.elements["antiaim"]["builder"]["jitter_fake_" + states[i].toLowerCase()] = menu_handle.AddCheckbox(["Rage", "      Anti-Aim", "      Anti-Aim"], "[ " + states[i] +" ]  Jitter Fake");
    }

    // ANTI-BRUTEFORCE
    const phase = ["2", "3", "4", "5", "6"];

    menu_handle.elements["antiaim"]["anti-bruteforce"]["enable_phase"] = menu_handle.AddCheckbox(["Rage", "      Anti-Aim", "      Anti-Aim"], "Enable Anti-Bruteforce");
    menu_handle.elements["antiaim"]["anti-bruteforce"]["phase"] = menu_handle.AddDropdown(["Rage", "      Anti-Aim", "      Anti-Aim"], "Phase number", phase, 0);
    menu_handle.elements["antiaim"]["anti-bruteforce"]["phase_1"] = menu_handle.AddSliderInt(["Rage", "      Anti-Aim", "      Anti-Aim"], "[ Phase 1 ]  Value", -60, 60);

    for (var i = 0; i < phase.length; i++)
    {
        menu_handle.elements["antiaim"]["anti-bruteforce"]["phase_" + phase[i]] = menu_handle.AddSliderInt(["Rage", "      Anti-Aim", "      Anti-Aim"], "[ Phase " + phase[i] +" ]  Value", -60, 60);
    }

    // VISUALS
    menu_handle.elements["visuals"]["colorpicker"] = menu_handle.AddColorPicker(["Rage", "      Visual", "      Visual"], "Accent Color");
    menu_handle.elements["visuals"]["gui_scale"] = menu_handle.AddDropdown(["Rage", "      Visual", "      Visual"], "GUI Scale", ["75%%", "100%%", "125%%"], 0);
    menu_handle.elements["visuals"]["indicator"] = menu_handle.AddMultiDropdown(["Rage", "      Visual", "      Visual"], "Display Indicator", ["Indicator", "Hotkey", "Anti-Bruteforce Timer"]);
    menu_handle.elements["visuals"]["information"] = menu_handle.AddMultiDropdown(["Rage", "      Visual", "      Visual"], "Display Information", ["Slowed Down", "Ping Carried Enemy"]);
    menu_handle.elements["visuals"]["avoid_scope"] = menu_handle.AddCheckbox(["Rage", "      Visual", "      Visual"], "Avoid Scope Lines");
}
menu_handle.create();

menu_handle.visibility = function()
{
    // ANTI AIM
    const states = ["Shared", "Stand", "Walk", "Slow", "Crouch", "Air"];

    for (var i = 0; i < states.length; i++)
    {
        UI.SetEnabled(menu_handle.elements["antiaim"]["builder"]["states"], (UI.GetValue(menu_handle.elements["antiaim"]["main"]) == 1) ? 1 : 0);

        var visible = undefined;

        if (states[i] != "Shared")
        {
            visible = (UI.GetValue(menu_handle.elements["antiaim"]["builder"]["enable_" + states[i].toLowerCase()]) == true) && (UI.GetValue(menu_handle.elements["antiaim"]["main"]) == 1) && (UI.GetValue(menu_handle.elements["antiaim"]["builder"]["states"]) == i);
            UI.SetEnabled(menu_handle.elements["antiaim"]["builder"]["enable_" + states[i].toLowerCase()], (UI.GetValue(menu_handle.elements["antiaim"]["builder"]["states"]) == i) && (UI.GetValue(menu_handle.elements["antiaim"]["main"]) == 1) ? 1 : 0);
        }
        else
            visible = (UI.GetValue(menu_handle.elements["antiaim"]["main"]) == 1) && (UI.GetValue(menu_handle.elements["antiaim"]["builder"]["states"]) == i);

        UI.SetEnabled(menu_handle.elements["antiaim"]["builder"]["right_yaw_" + states[i].toLowerCase()], visible ? 1 : 0);
        UI.SetEnabled(menu_handle.elements["antiaim"]["builder"]["left_yaw_" + states[i].toLowerCase()], visible ? 1 : 0);
        UI.SetEnabled(menu_handle.elements["antiaim"]["builder"]["jitter_yaw_" + states[i].toLowerCase()], visible ? 1 : 0);
        UI.SetEnabled(menu_handle.elements["antiaim"]["builder"]["jitter_yaw_value_" + states[i].toLowerCase()], visible && (UI.GetValue(menu_handle.elements["antiaim"]["builder"]["jitter_yaw_" + states[i].toLowerCase()]) != 0) ? 1 : 0);
        UI.SetEnabled(menu_handle.elements["antiaim"]["builder"]["right_fake_" + states[i].toLowerCase()], visible ? 1 : 0);
        UI.SetEnabled(menu_handle.elements["antiaim"]["builder"]["left_fake_" + states[i].toLowerCase()], visible ? 1 : 0);
        UI.SetEnabled(menu_handle.elements["antiaim"]["builder"]["jitter_fake_" + states[i].toLowerCase()], visible ? 1 : 0);
    }

    const phase = ["2", "3", "4", "5", "6"];
    const phase_number = UI.GetValue(menu_handle.elements["antiaim"]["anti-bruteforce"]["phase"]) + 2;

    for (var i = 0; i < phase.length; i++)
    {
        const visible = (UI.GetValue(menu_handle.elements["antiaim"]["main"]) == 2) && (UI.GetValue(menu_handle.elements["antiaim"]["anti-bruteforce"]["enable_phase"]) == true);
        
        UI.SetEnabled(menu_handle.elements["antiaim"]["anti-bruteforce"]["enable_phase"], (UI.GetValue(menu_handle.elements["antiaim"]["main"]) == 2) ? 1 : 0);
        UI.SetEnabled(menu_handle.elements["antiaim"]["anti-bruteforce"]["phase"], visible ? 1 : 0);
        UI.SetEnabled(menu_handle.elements["antiaim"]["anti-bruteforce"]["phase_1"], visible ? 1 : 0);
        UI.SetEnabled(menu_handle.elements["antiaim"]["anti-bruteforce"]["phase_" + phase[i]], visible && (phase[i] <= phase_number) ? 1 : 0);
    }
}

// HELPER
helper.clamp = function(value, min, max) 
{
    return Math.min(max, Math.max(min, value))
}

helper.radian_to_degree = function(rad)
{
    return rad * 180 / Math.PI;
}

helper.degree_to_radian = function(rad)
{
    return rad / 180 * Math.PI;
}

helper.vector = function(x, y, z)
{
    return [x, y, z];
}

helper.vec_multiply = function(a, b)
{
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

helper.vec_add = function(a, b)
{
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

helper.vec_length = function(a) 
{
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}

helper.vec_sub = function(a, b) 
{
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

helper.angle_on_screen = function(x, y)
{
    if (x == 0 && y == 0) return 0;

    return helper.radian_to_degree(Math.atan2(y,x));
}

helper.normalise_angle = function(angle)
{
    if (angle > 180)
        angle = angle -360;
    else if (angle < -180)
        angle = angle + 360;

    return angle;
}

helper.angle_to_vector = function(angles) 
{
    const sp = Math.sin(helper.degree_to_radian(angles[0]));
    const cp = Math.cos(helper.degree_to_radian(angles[0]));
    const sy = Math.sin(helper.degree_to_radian(angles[1]));
    const cy = Math.cos(helper.degree_to_radian(angles[1]));

    return [cp*cy, cp*sy, -sp];
}

helper.get_velocity = function(ent)
{
    const x = Entity.GetProp(ent, "CBasePlayer", "m_vecVelocity[0]")[0];
    const y = Entity.GetProp(ent, "CBasePlayer", "m_vecVelocity[0]")[1];
    const z = Entity.GetProp(ent, "CBasePlayer", "m_vecVelocity[0]")[2];
	if (x == 0) return;

	return Math.sqrt(x*x + y*y + z*z);
}

helper.in_air = function(ent)
{
    const flags = Entity.GetProp(ent, "CBasePlayer", "m_fFlags");
    
    if (!(flags & 1 << 0) && !(flags & 1 << 18))
        return true;

    return false;
}

helper.dist_to = function(a, b) 
{    
    return helper.vec_length([a[0] - b[0], a[1] - b[1], a[2] - b[2]])
}

helper.closest_point_on_ray = function(ray_from, ray_to, desired_point) 
{
    const to = helper.vec_sub(desired_point, ray_from);
    var direction = helper.vec_sub(ray_to, ray_from);
    const ray_length = helper.vec_length(direction);

    direction[0] = direction[0] / ray_length;
    direction[1] = direction[1] / ray_length;
    direction[2] = direction[2] / ray_length;

    const direction_along = direction[0] * to[0] + direction[1] * to[1] + direction[2] * to[2];
    if (direction_along < 0) return ray_from;
    if (direction_along > ray_length) return ray_to;
    
    return [ray_from[0] + direction[0] * direction_along, ray_from[1] + direction[1] * direction_along, ray_from[2] + direction[2] * direction_along];
}

helper.extrapolate = function(ent, position, ticks) 
{
    const velocity = Entity.GetProp(ent, "CBasePlayer", "m_vecVelocity[0]");
    const interval = Globals.TickInterval();

    position[0] += velocity[0] * interval * ticks;
    position[1] += velocity[1] * interval * ticks;
    position[2] += velocity[2] * interval * ticks;

    return position;
}

helper.clamp = function(value, min, max) 
{
    return Math.min(max, Math.max(min, value));
}

helper.lerp = function(time, start, end_pos) 
{
    time = helper.clamp(Globals.Frametime() * (time * 175), 0, 1);

    if (typeof(start) == 'object') 
    {
        var r = start[0],
            g = start[1],
            b = start[2],
            a = start[3];

        var e_r = end_pos[0],
            e_g = end_pos[1],
            e_b = end_pos[2],
            e_a = end_pos[3];

        r = math.lerp(time, r, e_r);
        g = math.lerp(time, g, e_g);
        b = math.lerp(time, b, e_b);
        a = math.lerp(time, a, e_a);

        return [r, g, b, a];
    }

    var delta = end_pos - start;
    delta = delta * time;
    delta = delta + start;

    if (end_pos == 0 && delta < 0.01 && delta > -0.01)
        delta = 0;
    else if (end_pos == 1 && delta < 1.01 && delta > 0.99)
        delta = 1;

    return delta;
}

// FREESTAND
freestand = 
{
    target: null,
    side: 0
};

freestand.closest_enemy = function()
{
    const local_player = Entity.GetLocalPlayer();
    const enemies = Entity.GetEnemies();
    var enemy = undefined;
    var fov = 180;

    const local_eyepos = Entity.GetEyePosition(local_player);
    const view_angles = Local.GetCameraAngles();


    for (var i = 0; i < enemies.length; i++) 
    {
        if (Entity.IsValid(enemies[i]) == true && Entity.IsAlive(enemies[i]) == true && Entity.IsDormant(enemies[i]) == false) 
        {
            const cur = Entity.GetProp(enemies[i], "CBaseEntity", "m_vecOrigin");
            const cur_fov = Math.abs(helper.normalise_angle(helper.angle_on_screen(local_eyepos[0] - cur[0], local_eyepos[1] - cur[1]) - view_angles[1] + 180));

            if (cur_fov < fov) 
            {
                fov = cur_fov;
                enemy = enemies[i];
            }
        }
    }

    freestand.target = enemy;
}

freestand.best_angle = function() 
{
    const local_player = Entity.GetLocalPlayer()
    const eye_position = Entity.GetEyePosition(local_player);
    const eye_angles = Local.GetViewAngles()[1];

    var data = {
        damages: [0, 0],
        fractions: {left: 0, right: 0}
    };

    freestand.side = 0;

    if (freestand.target) 
    {
        const head_position = Entity.GetHitboxPosition(freestand.target, 0);

        const multiplier = [32, 32, 32];
        const angles = [-90, 90];

        for (var i = 0; i < angles.length; i++) 
        {
            const current = angles[i];

            const direction = helper.vec_multiply(helper.angle_to_vector([0, eye_angles + current, 0]), multiplier);
            const point = helper.extrapolate(local_player, [
                eye_position[0] + direction[0],
                eye_position[1] + direction[1],
                eye_position[2] + direction[2],
            ], 4);

            const bullet = Trace.Bullet(local_player, freestand.target, point, head_position);

            if (!bullet) continue;

            data.damages[i] = bullet[1];
        }

        if (data.damages[0] < data.damages[1])
            freestand.side = 1;
        else if (data.damages[0] > data.damages[1])
            freestand.side = -1;
    }

    if (freestand.side) return;

    for (var i = eye_angles - 180; i < eye_angles + 180; i += 180 / 12) 
    {
        if (i === eye_angles) continue;

        const rotation = helper.degree_to_radian(i);

        const point = [
            eye_position[0] + Math.cos(rotation) * 256,
            eye_position[1] + Math.sin(rotation) * 256,
            eye_position[2]
        ];

        const line = Trace.Line(local_player, eye_position, point);
        if (!line) continue;

        data.fractions[i > eye_angles ? "right" : "left"] += line[1];
    }

    if (data.fractions.left < data.fractions.right)
        freestand.side = 1;
    else if (data.fractions.left > data.fractions.right) 
        freestand.side = -1;
}

freestand.update = function ()
{
    const local_player = Entity.GetLocalPlayer();

    if (!local_player || !Entity.IsAlive(local_player)) return;

    freestand.closest_enemy();
    freestand.best_angle();
}

// ANTIAIM
antiaim = 
{
    yaw : null,
    desync : null
};

antiaim.condition = {};

antiaim.condition["walk"] = function()
{
    return (helper.get_velocity(Entity.GetLocalPlayer()) > 5 && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) == 0) ? true : false; 
}

antiaim.condition["slow"] = function()
{
    return (helper.get_velocity(Entity.GetLocalPlayer()) > 5 && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) == 1) ? true : false; 
}

antiaim.condition["crouch"] = function()
{
    return (Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_flDuckAmount") > 0.5) ? true : false; 
}

antiaim.condition["air"] = function()
{
    return ((Input.IsKeyPressed(0x20) && helper.get_velocity(Entity.GetLocalPlayer()) > 100) || helper.in_air(Entity.GetLocalPlayer())) ? true : false; 
}

antiaim.current_condition = function()
{
    var state = undefined;

    if (antiaim.condition["air"]())
        state = UI.GetValue(menu_handle.elements["antiaim"]["builder"]["enable_air"]) == true ? "air" : "shared";
    else if (antiaim.condition["crouch"]())
        state = UI.GetValue(menu_handle.elements["antiaim"]["builder"]["enable_crouch"]) == true ? "crouch" : "shared";
    else if (antiaim.condition["slow"]())
        state = UI.GetValue(menu_handle.elements["antiaim"]["builder"]["enable_slow"]) == true ? "slow" : "shared";
    else if (antiaim.condition["walk"]())
        state = UI.GetValue(menu_handle.elements["antiaim"]["builder"]["enable_walk"]) == true ? "walk" : "shared";
    else
        state = UI.GetValue(menu_handle.elements["antiaim"]["builder"]["enable_stand"]) == true ? "stand" : "shared";

    return state;
}

antiaim.offsets = [];
antiaim.offsets.current_desync = 0;
antiaim.offsets.current_yaw = 0;

antiaim.controller = function()
{
    const local_player = Entity.GetLocalPlayer();
    if (!local_player || !Entity.IsAlive(local_player)) return;

    const states = ["Shared", "Stand", "Walk", "Slow", "Crouch", "Air"];
    const current_state = antiaim.current_condition();

    for (var i = 0; i < states.length; i++) 
    {
        if (current_state == states[i].toLowerCase())
        {
            AntiAim.SetOverride(1);

            const state = states[i].toLowerCase();

            if (antiaim.offsets[state] == undefined)
            {
                antiaim.offsets[state] = {};
                antiaim.offsets[state].yaw_jitter = true;
                antiaim.offsets[state].desync_jitter = true;
                antiaim.offsets[state].desync_override = 0;
                antiaim.offsets[state].yaw_override = 0;
            }
        
            var yaw_jitter = 0;
            var yaw_jitter_value = UI.GetValue(menu_handle.elements["antiaim"]["builder"]["jitter_yaw_value_" + state]);
        
            const is_bruteforce = helper.clamp((anti_bruteforce.reset_time - Globals.Realtime()) / anti_bruteforce.timer, 0, 1) > 0;
        
            if (is_bruteforce) 
            {
                freestand.side = anti_bruteforce.angle > 0 ? 1 : -1;
            }
                
            if (Globals.ChokedCommands() == 0) 
            {
                antiaim.offsets[state].yaw_jitter = !antiaim.offsets[state].yaw_jitter;
                antiaim.offsets[state].desync_jitter = UI.GetValue(menu_handle.elements["antiaim"]["builder"]["jitter_fake_" + state]) == true ? !antiaim.offsets[state].desync_jitter : false;
        
                if (freestand.side == -1) 
                {
                    antiaim.offsets[state].yaw_override = UI.GetValue(menu_handle.elements["antiaim"]["builder"]["left_yaw_" + state]);
                    antiaim.offsets[state].desync_override = antiaim.offsets[state].desync_jitter ? -18 : -UI.GetValue(menu_handle.elements["antiaim"]["builder"]["left_fake_" + state]);
                }
                else
                {
                    antiaim.offsets[state].yaw_override = UI.GetValue(menu_handle.elements["antiaim"]["builder"]["right_yaw_" + state]);
                    antiaim.offsets[state].desync_override = antiaim.offsets[state].desync_jitter ? 18 : UI.GetValue(menu_handle.elements["antiaim"]["builder"]["right_fake_" + state]);
                }
            }

            if (UI.GetValue(menu_handle.elements["antiaim"]["builder"]["jitter_yaw_" + state]) == 1)
            {
                yaw_jitter = antiaim.offsets[state].yaw_jitter ? 0 : yaw_jitter_value;
            }
            else if (UI.GetValue(menu_handle.elements["antiaim"]["builder"]["jitter_yaw_" + state]) == 2)
            {
                yaw_jitter = antiaim.offsets[state].yaw_jitter ? -yaw_jitter_value / 2 : yaw_jitter_value / 2;
            }
            else
            {
                yaw_jitter = 0;
                antiaim.offsets[state].yaw_jitter = false;
            }
            
            if (is_bruteforce) 
                antiaim.offsets[state].desync_override = anti_bruteforce.angle;
        
            antiaim.offsets.current_desync = antiaim.offsets[state].desync_override;
            antiaim.offsets.current_yaw = yaw_jitter + antiaim.offsets[state].yaw_override;

            AntiAim.SetRealOffset(antiaim.offsets.current_desync);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], antiaim.offsets.current_yaw);
        }
    }
}

// ANTI BRUTEFORCE
anti_bruteforce = 
{
    state : false,
    reset_time : 0,
    last_tick_triggered : 0,
    work_distance : 75,
    timer : 5,
    current_phase : 1,
    angle : 0
};

anti_bruteforce.bullet_impact = function(impact_vector, enemy_eye_position, eye_position) 
{
    const distance = helper.dist_to(helper.closest_point_on_ray(impact_vector, enemy_eye_position, eye_position), eye_position);
    if (distance > anti_bruteforce.work_distance) return;

    const phase_number = UI.GetValue(menu_handle.elements["antiaim"]["anti-bruteforce"]["phase"]) + 2;

    if (anti_bruteforce.reset_time < Globals.Realtime())
    {
        for (i = 1; i <= phase_number; i++) 
        {
            if (antiaim.offsets.current_desync < 0 && UI.GetValue(menu_handle.elements["antiaim"]["anti-bruteforce"]["phase_" + i]) >= 0)
            {
                anti_bruteforce.current_phase = i;
                break;
            } 
            else if (antiaim.offsets.current_desync > 0 && UI.GetValue(menu_handle.elements["antiaim"]["anti-bruteforce"]["phase_" + i]) < 0)
            {
                anti_bruteforce.current_phase = i;
                break;
            }
        }
    }
    else 
        anti_bruteforce.current_phase = 1 + (anti_bruteforce.current_phase % phase_number);

    anti_bruteforce.reset_time = Globals.Realtime() + anti_bruteforce.timer;
    anti_bruteforce.angle = UI.GetValue(menu_handle.elements["antiaim"]["anti-bruteforce"]["phase_" + anti_bruteforce.current_phase]);

    while (anti_bruteforce.angle == null)
    {
        anti_bruteforce.current_phase = 1 + (anti_bruteforce.current_phase % phase_number);
        anti_bruteforce.angle = UI.GetValue(menu_handle.elements["antiaim"]["anti-bruteforce"]["phase_" + anti_bruteforce.current_phase]);
    }

    anti_bruteforce.last_tick_triggered = Globals.Tickcount();
}

anti_bruteforce.pre_bullet_impact = function() 
{
    if (UI.GetValue(menu_handle.elements["antiaim"]["anti-bruteforce"]["enable_phase"]) == false) return;
    
    if (anti_bruteforce.last_tick_triggered == Globals.Tickcount()) return;

    const local_player = Entity.GetLocalPlayer();
    if (!local_player) return;

    const health = Entity.GetProp(local_player, 'CBasePlayer', 'm_iHealth');
    if (!health || health < 1) return;

    const userid = Event.GetInt('userid');
    if(!userid) return;

    const enemy = Entity.GetEntityFromUserID(userid);
    if (!enemy) return;

    if (Entity.IsDormant(enemy) || Entity.IsTeammate(enemy)) return;

    const local_eyepos = Entity.GetEyePosition(local_player);
    if (!local_eyepos) return;

    const enemy_eyepos = Entity.GetEyePosition(enemy);
    if (!enemy_eyepos) return;

    const x = Event.GetInt('x');
    const y = Event.GetInt('y');
    const z = Event.GetInt('z');

    if (!x || !y || !z) return;

    const impact_vector = [x, y, z];

    return anti_bruteforce.bullet_impact(impact_vector, enemy_eyepos, local_eyepos);
}

// FONT
font = 
{
    ["Arial"] : function(size) { return Render.GetFont("Arial.ttf", size, true); },
    ["Verdana"] : function(size) { return Render.GetFont("Verdana.ttf", size, true); },
    ["VerdanaB"] : function(size) { return Render.GetFont("Verdanab.ttf", size, true); },
    ["Tahoma"] : function(size) { return Render.GetFont("Tahoma.ttf", size, true); },
    ["Smallest"] : function(size) { return Render.GetFont("SMALLEST_PIXEL-7.ttf", size, true); },
    ["Icons"] : function(size) { return Render.GetFont("delusion_font.ttf", size, true); }
};

// COLOR
color = 
{
    ["white"] : function(alpha) { return [255,255,255,alpha]; },
    ["green"] : function(alpha) { return [155,200,21,alpha]; },
    ["red"] : function(alpha) { return [180,50,50,alpha]; },
    ["black"] : function(alpha) { return [0,0,0,alpha]; },
    ["blue"] : function(alpha) { return [0,170,255,alpha]; },
    ["purple"] : function(alpha) { return [89,119,239,alpha]; }
};

for (k in color)
{
    color[k + "_transparent"] = [color[k][0], color[k][1], color[k][2], 0];
}

color.equals = function(a, b) 
{
    return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3];
}

color.copy = function(color)
{
    return [color[0], color[1], color[2], color[3]];
}

// ANIMATION
animation.start_offset = 15;
animation.non_lerp_offset = animation.start_offset;

animation.speed = 0.2;
animation.item_list = [];

animation.items = [];

animation.update = function() 
{
    for (k in animation.items) 
    {
        if (!animation.items[k] || !animation.items[k].called_this_frame) 
        {
            if (typeof(animation.get(k).number) == 'object') 
            {
                if (color.equals(animation.new(k, [0, 0, 0, 0], true), [0, 0, 0, 0])) 
                {
                    animation.items[k] = undefined;
                }
            }
            else
            {
                if (animation.new(k, 0, true) == 0)
                {
                    animation.items[k] = undefined;
                }
            }
            continue;
        }

        animation.items[k].called_this_frame = false;
    }
}

animation.new = function(name, new_value, removing, speed_multiplier) 
{
    if (!animation.items[name]) 
    {
        animation.items[name] = {};
        animation.items[name].color = [0, 0, 0, 0];
        animation.items[name].number = 0;
        animation.items[name].called_this_frame = true;
    }

    if (speed_multiplier == undefined) 
    {
        speed_multiplier = 1;
    }

    if (removing == undefined) 
    {   
        animation.items[name].called_this_frame = true;
    }

    if (typeof(new_value) == 'object') 
    {
        const lerping = helper.lerp(animation.speed * speed_multiplier, animation.items[name].color, new_value);
        animation.items[name].color = lerping;

        return lerping;
    }

    const lerping = helper.lerp(animation.speed * speed_multiplier, animation.items[name].number, new_value);
    animation.items[name].number = lerping;

    return lerping;
}

animation.get = function(name) 
{
    return !animation.items[name] ? {number : 0, color : [0, 0, 0, 0], called_this_frame : false} : animation.items[name];
}

animation.extend = function(value) 
{
    if (typeof(value) != 'number')
        return animation.non_lerp_offset;

    animation.non_lerp_offset = animation.non_lerp_offset + value;
    return animation.non_lerp_offset;
}

// DRAW
draw.string_outline = function(x, y, center, text, color, outline_alpha, font)
{
    Render.String(x - 1, y - 1, center, text, [0,0,0,outline_alpha], font);
    Render.String(x - 1, y, center, text, [0,0,0,outline_alpha], font);
    Render.String(x - 1, y + 1, center, text, [0,0,0,outline_alpha], font);

    Render.String(x, y - 1, center, text, [0,0,0,outline_alpha], font);
    Render.String(x, y + 1, center, text, [0,0,0,outline_alpha], font);

    Render.String(x + 1, y - 1, center, text, [0,0,0,outline_alpha], font);
    Render.String(x + 1, y, center, text, [0,0,0,outline_alpha], font);
    Render.String(x + 1, y + 1, center, text, [0,0,0,outline_alpha], font);

    Render.String(x, y, center, text, color, font);
}

draw["indicators"] = {
    ["doubletap"] : {call : function() { return UI.GetValue([ "Rage", "Exploits", "SHEET_MGR", "Keys", "Key assignment", "Double tap"]); }, state : 0.01},
    ["damage"] : {call : function() { return UI.GetValue([ "Rage", "General", "SHEET_MGR", "General", "Key assignment", "Damage override"]); }, state : 0.01},
    ["hide shot"] : {call : function() { return UI.GetValue([ "Rage", "Exploits", "SHEET_MGR", "Keys", "Key assignment", "Hide shots"]); }, state : 0.01},
    ["baim"] : {call : function() { return UI.GetValue([ "Rage", "General", "SHEET_MGR", "General", "Key assignment", "Force body aim"]); }, state : 0.01},
    ["safe"] : {call : function() { return UI.GetValue([ "Rage", "General", "SHEET_MGR", "General", "Key assignment", "Force safe point"]); }, state : 0.01}
};

draw.controller = function()
{
    const local_player = Entity.GetLocalPlayer();

    if (!local_player || !Entity.IsAlive(local_player)) return;

    animation.update()
    animation.non_lerp_offset = animation.start_offset

    const multi_ind = UI.GetValue(["Rage", "      Visual", "      Visual", "Display Indicator"]);
    const multi_info = UI.GetValue(["Rage", "      Visual", "      Visual", "Display Information"]);

    const screen_size = Render.GetScreenSize();
    const accent_color = UI.GetColor(menu_handle.elements["visuals"]["colorpicker"]);

    const is_scoped = Entity.GetProp(local_player, "CCSPlayer", "m_bIsScoped");
    const is_scoped_value = animation.new("is_scoped", is_scoped && UI.GetValue(menu_handle.elements["visuals"]["avoid_scope"]) == true ? 1 : 0);

    const gui_scale = UI.GetValue(menu_handle.elements["visuals"]["gui_scale"]);
    var text_scale = 0;

    if (gui_scale == 0)
        text_scale = -3;
    else if (gui_scale == 2)
        text_scale = 3;  
    
    const script_name = "delusion";
    const script_name_size = Render.TextSize(script_name, font["Verdana"](12 + text_scale));
    const script_name_spacing = 0;

    // SCRIPT NAME ANIMATION
    if (multi_ind & (1 << 0))
    {
        for (char in script_name)
        {
            const pulse = Math.sin(Math.abs(-Math.PI + ((Globals.Realtime() + char / 10) * (1 / 0.5)) % (Math.PI * 2))) * 255;
    
            Render.String(screen_size[0] / 2 - script_name_size[0] / 2 + script_name_spacing + Math.round((script_name_size[0] + 20) / 2 * is_scoped_value) + 1, screen_size[1] / 2 + text_scale + 18, 0, script_name[char], color["black"](255), font["Verdana"](12 + text_scale));
            Render.String(screen_size[0] / 2 - script_name_size[0] / 2 + script_name_spacing + Math.round((script_name_size[0] + 20) / 2 * is_scoped_value), screen_size[1] / 2 + text_scale + 17, 0, script_name[char], color["white"](255), font["Verdana"](12 + text_scale));
            Render.String(screen_size[0] / 2 - script_name_size[0] / 2 + script_name_spacing + Math.round((script_name_size[0] + 20) / 2 * is_scoped_value), screen_size[1] / 2 + text_scale + 17, 0, script_name[char], [accent_color[0], accent_color[1], accent_color[2], pulse], font["Verdana"](12 + text_scale));
    
            script_name_spacing += Render.TextSize(script_name[char], font["Verdana"](12 + text_scale))[0];
        }
        animation.extend(script_name_size[1] + 10);
    }

    // ANTI-BRUTEFORCE TIMER
    if (multi_ind & (1 << 2))
    {
        const brute_time = helper.clamp((anti_bruteforce.reset_time - Globals.Realtime()) / anti_bruteforce.timer, 0, 1);

        if (brute_time > 0)
            animation.new('antibrute_line', 1);

        const brute_anim = animation.get('antibrute_line').number;
        const is_brute = brute_anim > 0;

        if (is_brute)
        {
            Render.FilledRect(screen_size[0] / 2 - script_name_size[0] / 2 + Math.round((script_name_size[0] + 20) / 2 * is_scoped_value), screen_size[1] / 2 + animation.extend() + text_scale - 4, script_name_size[0] + 1, (gui_scale == 1 || gui_scale == 0) ? 3 : 4, [25, 25, 25, Math.round(150 * brute_anim)]);
            Render.FilledRect(screen_size[0] / 2 - script_name_size[0] / 2 + Math.round((script_name_size[0] + 20) / 2 * is_scoped_value) + 1, screen_size[1] / 2 + animation.extend() + text_scale - 3, Math.round(script_name_size[0] * brute_time), (gui_scale == 1 || gui_scale == 0) ? 1 : 2, [255, 255, 255, Math.round(255 * brute_anim)]);
    
            animation.extend(Math.round(brute_anim * 3));
        }
    }

    // ADDITIONAL IND
    if (multi_ind & (1 << 1))
    {
        for (value in draw["indicators"])
        {
            draw["indicators"][value].state = animation.new(value, draw["indicators"][value].call() ? 1 : 0);

            const name_size = Render.TextSize(value, font["Tahoma"](10 + text_scale));

            draw.string_outline(screen_size[0] / 2  + Math.round((name_size[0] + 20) / 2 * is_scoped_value), screen_size[1] / 2 + animation.extend() + text_scale -3, 1, value, color["white"](Math.round(255 * draw["indicators"][value].state)), Math.round(255 * draw["indicators"][value].state), font["Tahoma"](10 + text_scale));
    
            animation.extend(Math.round(name_size[1] * draw["indicators"][value].state));
        }
    }

    // SLOW DOWN WARNING
    if (multi_info & (1 << 0))
    {
        const modifier = Entity.GetProp(local_player, "CCSPlayer", "m_flVelocityModifier");
        const modified_percentage = (100 * modifier).toFixed(0);

        const pulse = Math.floor(Math.sin(Math.abs(-Math.PI + (Globals.Realtime() * (1 / 0.35)) % (Math.PI * 2))) * 255);
        const state = animation.new("showed_down", modifier != 1 ? 1 : 0, undefined, 0.095)
    
        if (state != 0) 
        {
            Render.String(screen_size[0] / 2 - 60, 325, 1, "a", [200, 200, 200, (pulse * state)], font["Icons"](70));
            Render.String(screen_size[0] / 2 + 22 + 1, 340 + 1, 1, "SLOWED: " + modified_percentage + "%", color["black"](Math.round(255 * state / 3)), font["Verdana"](13));
            Render.String(screen_size[0] / 2 + 22, 340, 1, "SLOWED: " + modified_percentage + "%", color["white"](Math.round(255 * state)), font["Verdana"](13));
    
            Render.FilledRect(screen_size[0] / 2 - 30 - 1, 360 - 1, 110 + 2, 14, [0, 0, 0, Math.round(200 * state)]);
            Render.FilledRect(screen_size[0] / 2 - 30, 360, modifier * 110, 12, [accent_color[0], accent_color[1], accent_color[2], Math.round(255 * state)]);
        }
    }

    // PING CARRIED
    if (multi_info & (1 << 1))
    {
        const enemies = Entity.GetEnemies();
        const ping = Math.round(Entity.GetProp(Entity.GetLocalPlayer(), "CPlayerResource", "m_iPing"));
        
        for (var i = 0; i < enemies.length; i++)
        {
            const enemy = enemies[i]

            if (Entity.IsValid(enemy) == true && Entity.IsAlive(enemy) == true && Entity.IsDormant(enemy) == false && Entity.IsBot(enemy) == false) 
            {
                const ping_enemy = Math.round(Entity.GetProp(enemy, "CPlayerResource", "m_iPing"));

                if (ping > ping_enemy)
                {
                    enemy_hitpos = Entity.GetRenderOrigin(enemy);
                    local_hitpos = Entity.GetRenderOrigin(local_player);

                    var dist = helper.dist_to(local_hitpos, enemy_hitpos);

                    enemy_hitpos[2] = enemy_hitpos[2] + (74 + text_scale) + dist / 30;
                    enemy_pos = Render.WorldToScreen(enemy_hitpos);
                    
                    if (enemy_pos[2] == 1)
                    {
                        Render.String(enemy_pos[0] + 1, enemy_pos[1] + 1, 1, "PING CARRIED (" + ping_enemy + ")", color["black"](255), font["VerdanaB"](7 + text_scale));
                        Render.String(enemy_pos[0], enemy_pos[1], 1, "PING CARRIED (" + ping_enemy + ")", color["red"](255), font["VerdanaB"](7 + text_scale));
                    }
                }
            }
        }
    }
}

const unload = function()
{
    AntiAim.SetOverride(0);
}

Cheat.RegisterCallback('bullet_impact', 'anti_bruteforce.pre_bullet_impact');

Cheat.RegisterCallback("CreateMove", "freestand.update");
Cheat.RegisterCallback("CreateMove", "antiaim.controller");

Cheat.RegisterCallback("Draw", "menu_handle.visibility");
Cheat.RegisterCallback("Draw", "draw.controller");

Cheat.RegisterCallback("Unload", "unload");